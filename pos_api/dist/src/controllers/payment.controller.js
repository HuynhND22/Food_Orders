"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ultil_1 = require("../config/payment/ultil");
const data_source_1 = require("../data-source");
const envBankPayment_1 = require("../config/payment/envBankPayment");
require('dotEnv').config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = require('socket.io')(server);
const order_entity_1 = require("../entities/order.entity");
const repository = data_source_1.AppDataSource.getRepository(order_entity_1.Order);
const paymentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = parseInt(req.params.orderId);
        const order = yield repository.findOneBy({ orderId: orderId });
        if (!order) {
            return res.sendStatus(410);
        }
        if (order.payment != 'Ngân hàng') {
            return res.status(400).json({ error: 'Online payment method only available for payment type [Ngân hàng]' });
        }
        if (order.statusId != 10) {
            return res.status(400).json({ error: 'Order already payment' });
        }
        const totalPrice = yield repository.manager.query(`EXEC CalculateTotalPrice @OrderId = ${orderId}`);
        console.log(totalPrice);
        const deviceId = (0, ultil_1.getDeviceId)();
        const username = process.env.BANK_USERNAME;
        const password = process.env.BANK_PASSWORD;
        const accountId = process.env.BANK_ACCOUNT_ID;
        const login = yield (0, envBankPayment_1.handleLogin)(username, password, deviceId);
        io.on('connection', (socket) => {
            socket.emit('orders', 'openTabPayment');
        });
        let paymentSuccess = false;
        if (login.access_token) {
            const waitting = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                const histories = yield (0, envBankPayment_1.getHistories)(login.access_token, accountId, deviceId);
                if (histories) {
                    const filterCRDT = histories.transactionInfos.filter((transaction) => transaction.creditDebitIndicator === 'CRDT'); //CRDT (+), DBIT(-)
                    const result = filterCRDT.find((transaction) => transaction.description.indexOf(order.orderId) !== -1 && transaction.amount == totalPrice[0].TotalPrice);
                    console.log(result);
                    try {
                        if (result) {
                            clearInterval(waitting);
                            paymentSuccess = true;
                            const paymented = { statusId: 11 };
                            Object.assign(order, paymented);
                            yield repository.save(order);
                            io.on('connection', (socket) => {
                                socket.emit('orders', 'closeTabPayment');
                            });
                            res.status(200).json({ message: 'Payment success' });
                            process.exit();
                        }
                    }
                    catch (error) {
                        console.log(error);
                        res.status(400).json({ error: 'update status order failed' });
                        process.exit();
                    }
                }
            }), 500);
            setTimeout(() => {
                if (!paymentSuccess) {
                    clearInterval(waitting);
                    return res.status(400).json({ error: 'Payment failed' });
                }
            }, 5 * 60 * 1000); // stop interval after 5 minutes
            io.on('connection', (socket) => {
                socket.emit('orders', 'closeTabPayment');
            });
        }
        else {
            return res.status(500).json({ error: 'Bank login failed' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { paymentHandler };
