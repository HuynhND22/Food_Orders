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
const cart_entity_1 = require("../entities/cart.entity");
const repository = data_source_1.AppDataSource.getRepository(cart_entity_1.Cart);
const getByTableId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tableId = req.params.tableId;
    console.log(tableId);
    try {
        const cart = yield repository.find({ where: { tableId: parseInt(tableId) }, relations: ['productSizes.product', 'productSizes.size', 'promotion'] });
        cart ? res.status(200).json(cart) : res.sendStatus(410);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body;
        const cart = new cart_entity_1.Cart();
        Object.assign(cart, data);
        yield repository.save(cart);
        return res.status(201).json(cart);
    }
    catch (error) {
        if (error.number === 2627) {
            return res.status(400).json({ error: 'Cart already exists' });
        }
        console.error(error);
        return res.status(500).json(error);
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const quantity = Number(req.query.quantity);
    const cartId = parseInt(req.params.id);
    const cart = yield repository.findOneBy({ cartId: cartId });
    if (!cart) {
        return res.status(410).json({ error: 'Not found' });
    }
    if (quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }
    else if (quantity == 0) {
        try {
            yield repository.delete({ cartId: cartId });
            return res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        try {
            Object.assign(cart, { quantity: quantity });
            yield repository.save(cart);
            return res.json(cart);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
});
const hardDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carts = yield repository.find({ where: { tableId: parseInt(req.params.tableId) } });
        if (carts.length == 0) {
            return res.status(410).json({ error: 'Not found' });
        }
        repository.delete({ tableId: parseInt(req.params.tableId) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { getByTableId, create, update, hardDelete };
