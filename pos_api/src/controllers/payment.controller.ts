import { NextFunction, Request, Response } from 'express';
import { getDeviceId } from "../config/payment/ultil";
import { IsNull, Like, Not } from 'typeorm';
import { AppDataSource } from '../data-source';
import {convertToUpperCaseString} from '../helpers/convertToUpperCaseString'
import { handleLogin, getHistories, getBankList, verify } from "../config/payment/envBankPayment";
require('dotenv').config();
import { getIO } from '../config/socket/socketServer';
import { startInterval, clearIntervalById  } from '../helpers/intervalManager';

import express from "express";
import http from "http";
import loginCache from '../config/payment/loginCache';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const intervalMap = new Map<string, NodeJS.Timeout>();

import { Order } from '../entities/order.entity';
import {BankInformation} from '../entities/bankInfomation.entity'
import { BankHistory } from '../entities/bankHistory.entity';


const repository = AppDataSource.getRepository(Order);
const bankInformationRepo = AppDataSource.getRepository(BankInformation)
const bankHistoryRepo = AppDataSource.getRepository(BankHistory)
const deviceId = 'uWiOj1ry5bCZzniWIiNXonv6wGR42139L2aKKnocCBvfA';

const loginBank = async (username: string, password: string) => {
    let transaction_id = '';
    const login = await handleLogin(username, password, deviceId, loginCache['tp']?.transactionId);
    if (!login) throw new Error('Login failed');
  
    if (login.error?.error_code === '70101') {
      transaction_id = login.error.transaction_id;
    }
  
    loginCache['tp'] = {
      username,
      password,
      accessToken: login.access_token,
      transactionId: transaction_id,
    };
  
    const list = await getBankList(login.access_token, deviceId);
  
    const dataToInsert = list.map((item: any) => {
      const bank = new BankInformation();
      bank.accountNumber = item.BBAN;
      bank.author = item.name;
      return bank;
    });
  
    await bankHistoryRepo.delete({});
    await bankInformationRepo.delete({});
    await bankInformationRepo.save(dataToInsert);
  
    return dataToInsert;
  };

  const adminLoginBank = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const result = await loginBank(username, password);
      res.status(200).json(result);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

const runFetch = async (req: Request, res: Response) => {
    try {
        const transactionCache: Record<string, boolean> = {};
        const {accountNumber} = req.body
        const account = await bankInformationRepo.findOneBy({accountNumber: accountNumber})
        if(!account) return res.status(400).send({error: 'Not found account number'})
        
        await bankInformationRepo
        .createQueryBuilder()
        .update()
        .set({
            activate: () => `
            CASE
                WHEN accountNumber = :accountNumber THEN '1'
                ELSE NULL
            END
            `,
        })
        .setParameters({ accountNumber })
        .execute();
        

        clearIntervalById('fetch_data')
        startInterval('fetch_data', async () => {
            console.log('run bank:', accountNumber);
            try {
                const data = loginCache['tp'];
                const histories = await getHistories(data?.accessToken, accountNumber, deviceId);
            
                if (!histories) throw new Error()

                const newTransactions = histories.transactionInfos.filter((tx: any) =>
                    tx.creditDebitIndicator === 'CRDT' && !transactionCache[tx.id]
                );
        
                if (newTransactions.length > 0) {
                console.log(`Có ${newTransactions.length} giao dịch mới.`);
        
                const dataToInsert = newTransactions.map((tx: any) => {
                    transactionCache[tx.id] = true;
        
                    return bankHistoryRepo.create({
                        accountNumber: accountNumber,
                        amount: parseInt(tx.amount),
                        description: tx.description,
                        historyId: tx.id
                    });
                });
        
                await bankHistoryRepo.save(dataToInsert);
                } else {
                console.log('Không có giao dịch mới.');
                }
                
            } catch (error) {
                console.log('loi fetch:', error)
                try {
                    await loginBank(loginCache['tp']?.username, loginCache['tp']?.password)
                } catch (error) {
                    throw new Error                    
                }
            }
        }, 5000);
      
        return res.sendStatus(200)
    } catch (error) {
        return res.status(400).send({error: error})
    }
    
    // return res.send(data)
    // const {access_token , account_number} = req.body
    // const deviceId = 'QUtDAM9vBma9Lac2v6gP5w9I8pOsnwV9qDs53qZOaLZ99';

}

const adminLogoutBank = async (req: Request, res: Response) => {
    clearIntervalById('fetch_data')
    res.sendStatus(200)
}

const verification = async (req: Request, res: Response) => {
    const {rsa_token, transaction_id} = req.body

    const result = await verify(transaction_id, rsa_token, deviceId)

    res.json(result)

}

// const paymentHandler = async (req: Request, res: Response, next: NextFunction) => {

//     const orderId = parseInt(req.params.orderId);

//     if (intervalMap.has(orderId.toString())) {
//         console.log(`Interval with id ${orderId} already exists.`);
//         return res.sendStatus(200)
//     }

//     let order:any;
//     let totalPrice:any;
//     let login:any;
//     const username = process.env.BANK_USERNAME;
//     const password = process.env.BANK_PASSWORD;
//     const accountId = process.env.BANK_ACCOUNT_ID;
//     const deviceId = 'QUtDAM9vBma9Lac2v6gP5w9I8pOsnwV9qDs53qZOaLZ99';

//     try {
//         order = await repository.findOneBy({orderId: orderId})
//         totalPrice = await repository.manager.query(`SELECT CalculateTotalPrice(${orderId})`);
        

//         login = await handleLogin(username, password, deviceId);

//         if(!order){ 
//             return res.sendStatus(410);
//         }
//         if (order.payment != 'Ngân hàng') {
//             return res.status(400).json({error: 'Online payment method only available for payment type [Ngân hàng]'})
//         }
//         if (order.statusId != 10) {
//             return res.status(400).json({error: 'Order already payment'})
//         }
//     } catch (error) {
//         console.log(error);    
//         return res.status(500).json({error: 'Internal server error'})
//     }

//     console.log(totalPrice)        

//     let paymentSuccess = false;

//     if (login.access_token) {
//         startInterval(order.orderId.toString(), async ()=>{
//             try {
//                 const histories = await getHistories(login.access_token, accountId, deviceId);
//                 if (histories) {
//                     const filterCRDT = histories.transactionInfos.filter((transaction:any) => transaction.creditDebitIndicator === 'CRDT'); //CRDT (+), DBIT(-)
//                     const result = filterCRDT.find((transaction:any) => transaction.description.indexOf(order.orderId) !== -1 && transaction.amount == totalPrice[0].calculatetotalprice);
//                     console.log(result);
//                         if (result) {
//                             clearIntervalById(order.orderId.toString())
//                             const paymented = {statusId: 11};
//                             Object.assign(order, paymented);
//                             await repository.save(order);
//                             paymentSuccess = true
//                             const io = getIO();
//                             io.to('paymentSessionId').emit('payment-success');
//                         }
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }, 5000)

//         setTimeout(() => {
//             if (paymentSuccess === false) {
//                 clearIntervalById(order.orderId)
//             }
//         }, 5 * 60 * 1000); // stop interval after 5 minutes
        
//         return res.sendStatus(200);
//     } else {
//         return res.status(500).json({ error: 'Bank login failed' });
//     }      
// }

const paymentHandler = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = parseInt(req.params.orderId);
    let paymentSuccess= false

    const order = await repository.findOneBy({orderId: orderId})
    if(!order) return res.status(400).send({error: 'not found orderId'})
    const totalPrice = await repository.manager.query(`SELECT CalculateTotalPrice(${orderId})`);

        startInterval(orderId.toString(), async ()=>{
            console.log('start handle payment')
            try {
                const histories = await bankHistoryRepo.findOne({
                    where: {
                      description: Like(`%${orderId}%`)
                    }
                  });
                if(histories) {
                    paymentSuccess = true
                    clearIntervalById(orderId.toString())
                    Object.assign(order, {statusId: 11});
                    await repository.save(order);
                    paymentSuccess = true
                    const io = getIO();
                    io.to('paymentSessionId').emit('payment-success');
                }
            } catch (error) {
                console.log(error);
            }
        }, 5000)

        setTimeout(() => {
            if (paymentSuccess === false) {
                clearIntervalById(orderId.toString())
            }
        }, 5 * 60 * 1000);
        
        return res.sendStatus(200);
}

const getInfo = async (req:Request, res:Response) => {
    try {
        const bankInfo = await bankInformationRepo.find()
        bankInfo ? res.json(bankInfo) : res.sendStatus(204)
    } catch (error) {
        console.log(error);    
        res.status(500).json({error: 'Internal server error'})
    }
}

const updateBank = async (req:Request, res:Response) => {
    console.log(req.body)
    try {
        let data = req.body;
        data['author'] = convertToUpperCaseString(req.body.author)
        const banks = new BankInformation();
        Object.assign(banks, data);
        bankInformationRepo.save(banks);
        return res.json(banks);
    } catch (error) {
        console.log(error);    
        return res.status(500).json({error: 'Internal server error'})
    }
}


export default {paymentHandler, getInfo, updateBank, adminLoginBank, adminLogoutBank, runFetch, verification}
