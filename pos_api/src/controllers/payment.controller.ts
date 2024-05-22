import { NextFunction, Request, Response } from 'express';
import { getDeviceId } from "../config/payment/ultil";
import { AppDataSource } from '../data-source';
import { handleLogin, getHistories } from "../config/payment/envBankPayment";
require('dotenv').config();

import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

import { Order } from '../entities/order.entity';
const repository = AppDataSource.getRepository(Order);

const paymentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const order = await repository.findOneBy({orderId: orderId})
        if(!order){ 
            return res.sendStatus(410);
        }
        if (order.payment != 'Ngân hàng') {
            return res.status(400).json({error: 'Online payment method only available for payment type [Ngân hàng]'})
        }
        if (order.statusId != 10) {
            return res.status(400).json({error: 'Order already payment'})
        }

        const totalPrice = await repository.manager.query(`EXEC CalculateTotalPrice @OrderId = ${orderId}`);
        console.log(totalPrice)
        const deviceId = getDeviceId();
        const username = process.env.BANK_USERNAME;
        const password = process.env.BANK_PASSWORD;
        const accountId = process.env.BANK_ACCOUNT_ID;

        const login = await handleLogin(username, password, deviceId);
        
        io.on('connection',(socket:any) => {
            socket.emit('orders','openTabPayment');
        });
        let paymentSuccess = false;

            if (login.access_token) {
                const waitting = setInterval(async () => {
                    const histories = await getHistories(login.access_token, accountId, deviceId);
                    if (histories) {
                        const filterCRDT = histories.transactionInfos.filter((transaction:any) => transaction.creditDebitIndicator === 'CRDT'); //CRDT (+), DBIT(-)
                        const result = filterCRDT.find((transaction:any) => transaction.description.indexOf(order.orderId) !== -1 && transaction.amount == totalPrice[0].TotalPrice);
                        console.log(result);
                        try {
                            if (result) {
                                clearInterval(waitting);
                                paymentSuccess = true;
                                const paymented = {statusId: 11};
                                Object.assign(order, paymented);
                                await repository.save(order);
                                io.on('connection', (socket:any) => {
                                    socket.emit('orders', 'closeTabPayment');
                                });
                                res.status(200).json({message: 'Payment success'});
                                process.exit()
                            }
                        } catch (error) {
                            console.log(error);
                            res.status(400).json({error: 'update status order failed'});
                            process.exit()
                        }
                    }
                }, 500);

                setTimeout(() => {
                    if (!paymentSuccess) {
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
      } catch (error:any) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}



export default {paymentHandler}
