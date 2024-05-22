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
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const order_entity_1 = require("../entities/order.entity");
const orderDetail_entity_1 = require("../entities/orderDetail.entity");
const cart_entity_1 = require("../entities/cart.entity");
const typeorm_1 = require("typeorm");
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const productSize_entity_1 = require("../entities/productSize.entity");
const promotion_entity_1 = require("../entities/promotion.entity");
const orderRepository = data_source_1.AppDataSource.getRepository(order_entity_1.Order);
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderRepository.find();
        if (orders.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderRepository.findOne({
            where: { orderId: parseInt(req.params.id) },
            relations: ['orderDetails']
        });
        order ? res.status(200).json(order) : res.sendStatus(410);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryRunner = orderRepository.manager.connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            const order = req.body;
            const result = yield queryRunner.manager.save(order_entity_1.Order, order);
            const carts = yield queryRunner.manager.find(cart_entity_1.Cart, { where: { tableId: order.tableId } });
            const orderDetails = [];
            for (const od of carts) {
                if (od.productSizeId) {
                    let productSize = yield queryRunner.manager.findOne(productSize_entity_1.ProductSize, { where: { productSizeId: od.productSizeId } });
                    if (productSize) {
                        orderDetails.push(Object.assign(Object.assign({}, od), { orderId: result.orderId, price: productSize.price, discount: productSize.discount }));
                    }
                }
                if (od.promotionId) {
                    let promotion = yield queryRunner.manager.findOne(promotion_entity_1.Promotion, { where: { promotionId: od.promotionId } });
                    if (promotion) {
                        orderDetails.push(Object.assign(Object.assign({}, od), { orderId: result.orderId, price: promotion.price }));
                    }
                }
                yield queryRunner.manager.delete(cart_entity_1.Cart, od.cartId);
            }
            try {
                yield queryRunner.manager.save(orderDetail_entity_1.OrderDetail, orderDetails);
            }
            catch (error) {
                console.log(error);
                return res.json(error);
            }
            yield queryRunner.commitTransaction();
            if (result.payment == "Ngân hàng") {
                return res.redirect(`/payments/handler/${result.orderId}`);
            }
            else {
                return res.redirect(`/orders/id/${result.orderId}`);
            }
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            console.log(error);
            return res.status(500).json({ error: 'Transaction failed' });
        }
        finally {
            yield queryRunner.release();
        }
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryRunner = orderRepository.manager.connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            const order = req.body;
            const found = yield queryRunner.manager.findOne(order_entity_1.Order, { where: { orderId: parseInt(req.params.id) } });
            console.table(found);
            if (found) {
                found.tableId = order.tableId;
                found.userId = order.userId;
                found.statusId = order.statusId;
                found.payment = order.payment;
            }
            else {
                return res.sendStatus(410).json(found);
            }
            yield queryRunner.manager.save(found, order);
            if (order.orderDetails) {
                yield queryRunner.manager.delete(orderDetail_entity_1.OrderDetail, { orderId: parseInt(req.params.id) });
                const orderDetails = order.orderDetails.map((pd) => {
                    return Object.assign(Object.assign({}, pd), { orderId: parseInt(req.params.id) });
                });
                yield queryRunner.manager.save(orderDetail_entity_1.OrderDetail, orderDetails);
            }
            yield queryRunner.commitTransaction();
            const result = yield orderRepository.findOne({ where: { orderId: parseInt(req.params.id) }, relations: ['orderDetails'] });
            res.status(200).send(result);
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            if (error.number == 2627) {
                const message = (0, handleUniqueError_1.handleUniqueError)(error);
                return res.status(400).json({ error: message });
            }
            console.log(error);
            return res.status(500).send(error);
        }
        finally {
            yield queryRunner.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderRepository.findOneBy({ orderId: parseInt(req.params.id) });
        if (!order) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield orderRepository.softDelete({ orderId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const restore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderRepository.findOne({ withDeleted: true, where: { orderId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!order) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield orderRepository.restore({ orderId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderRepository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }, relations: ['orderDetails'] });
        if (orders.length === 0) {
            return res.status(204).send({
                error: 'No content'
            });
        }
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const hardDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderRepository.findOne({ withDeleted: true, where: { orderId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!order) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield orderRepository.delete({ orderId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { getAll,
    getById,
    create,
    update,
    softDelete,
    restore,
    getDeleted,
    hardDelete
};
