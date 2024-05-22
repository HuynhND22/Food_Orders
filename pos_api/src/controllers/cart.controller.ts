import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Cart } from '../entities/cart.entity';

const repository = AppDataSource.getRepository(Cart);

const getByTableId = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    console.log(tableId);
    try {
        const cart = await repository.find({ where: {tableId: parseInt(tableId)}, relations: ['productSizes.product','productSizes.size', 'promotion'] });
        cart ? res.status(200).json(cart) : res.sendStatus(410);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data = req.body;
        
        const cart = new Cart();
        Object.assign(cart, data);
        await repository.save(cart);

        return res.status(201).json(cart);
    } catch (error: any) {
        if(error.number === 2627) {
            return res.status(400).json({ error: 'Cart already exists' });
        }
        console.error(error);
        return res.status(500).json(error);
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const quantity = Number(req.query.quantity);
    const cartId = parseInt(req.params.id)

    const cart = await repository.findOneBy({ cartId: cartId });
    if (!cart) {
        return res.status(410).json({ error: 'Not found' });
    }

    if (quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be greater than zero' });
    } else if (quantity == 0) {
        try {
            await repository.delete({ cartId: cartId });
            return res.sendStatus(200);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        try {
            Object.assign(cart, {quantity: quantity});
            await repository.save(cart);
            return res.json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const hardDelete = async (req: Request, res: Response) => {
    try {

        const carts = await repository.find({where: {tableId: parseInt(req.params.tableId)} });
        if (carts.length == 0) {
            return res.status(410).json({ error: 'Not found' });
        }
        repository.delete({ tableId: parseInt(req.params.tableId) });
        
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default {getByTableId, create, update, hardDelete}
