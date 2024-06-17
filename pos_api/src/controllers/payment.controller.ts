import { NextFunction, Request, Response } from 'express';
import { getDeviceId } from "../config/payment/ultil";
import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import {convertToUpperCaseString} from '../helpers/convertToUpperCaseString'
import { handleLogin, getHistories } from "../config/payment/envBankPayment";
require('dotenv').config();

import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

import { Order } from '../entities/order.entity';
import {BankInfomation} from '../entities/bankInfomation.entity'

const repository = AppDataSource.getRepository(Order);
const bankRepo = AppDataSource.getRepository(BankInfomation)

const paymentHandler = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = parseInt(req.params.orderId);

    let order:any;
    let totalPrice:any;
    let login:any;
    const username = process.env.BANK_USERNAME;
    const password = process.env.BANK_PASSWORD;
    const accountId = process.env.BANK_ACCOUNT_ID;
    const deviceId = getDeviceId();    

    try {
        order = await repository.findOneBy({orderId: orderId})
        totalPrice = await repository.manager.query(`EXEC CalculateTotalPrice @OrderId = ${orderId}`);
        

        login = await handleLogin(username, password, deviceId);

        if(!order){ 
            return res.sendStatus(410);
        }
        if (order.payment != 'Ngân hàng') {
            return res.status(400).json({error: 'Online payment method only available for payment type [Ngân hàng]'})
        }
        if (order.statusId != 10) {
            return res.status(400).json({error: 'Order already payment'})
        }
    } catch (error) {
        console.log(error);    
        return res.status(500).json({error: 'Internal server error'})
    }

    console.log(totalPrice)        
    io.on('connection',(socket:any) => {
        socket.emit('orders','openTabPayment');
    });
    let paymentSuccess = false;

    if (login.access_token) {
        const waitting = setInterval(async () => {
            try {
                const histories = await getHistories(login.access_token, accountId, deviceId);
                if (histories) {
                    const filterCRDT = histories.transactionInfos.filter((transaction:any) => transaction.creditDebitIndicator === 'CRDT'); //CRDT (+), DBIT(-)
                    const result = filterCRDT.find((transaction:any) => transaction.description.indexOf(order.orderId) !== -1 && transaction.amount == totalPrice[0].TotalPrice);
                    console.log(result);
                        if (result) {
                            clearInterval(waitting);
                            paymentSuccess = true;
                            const paymented = {statusId: 11};
                            Object.assign(order, paymented);
                            await repository.save(order);
                            // io.on('connection', (socket:any) => {
                            //     socket.emit('orders', 'closeTabPayment');
                            // });
                            console.log(paymentSuccess); 
                            return res.status(200).json({message: 'Payment success'});
                            // process.exit()
                        }
                }
            } catch (error) {
                console.log(error);
                return res.status(400).json({error: 'update status order failed'});
            }
        }, 5000);

        setTimeout(() => {
            if (paymentSuccess === false) {
                clearInterval(waitting);
                return res.status(400).json({error: 'Payment failed'});
            }
        }, 5 * 60 * 1000); // stop interval after 5 minutes
        
        io.on('connection', (socket:any) => {
            socket.emit('orders', 'closeTabPayment');
        });
    } else {
        return res.status(500).json({ error: 'Bank login failed' });
    }      
}

const getInfo = async (req:Request, res:Response) => {
    try {
        const bankInfo = await bankRepo.findOne({where: {}})
        bankInfo ? res.json(bankInfo) : res.sendStatus(204)
    } catch (error) {
        console.log(error);    
        res.status(500).json({error: 'Internal server error'})
    }
}

const updateBank = async (req:Request, res:Response) => {
    try {
        let data = req.body;
        data['author'] = convertToUpperCaseString(req.body.author)
        const banks = new BankInfomation();
        Object.assign(banks, data);
        bankRepo.save(banks);
        return res.json(banks);
    } catch (error) {
        console.log(error);    
        return res.status(500).json({error: 'Internal server error'})
    }
}


export default {paymentHandler, getInfo, updateBank}
