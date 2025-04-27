import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { OrderDetail } from "../entities/orderDetail.entity";
import { Cart } from "../entities/cart.entity";
import { IsNull, Not } from "typeorm";
import { handleUniqueError } from "../helpers/handleUniqueError";
import { ProductSize } from "../entities/productSize.entity";
import { Promotion } from "../entities/promotion.entity";

const orderRepository = AppDataSource.getRepository(Order);


const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderRepository.find({ order: {
                createdAt: 'DESC'
            },
            relations: ['orderDetails.productSize.product', 'orderDetails.productSize.size', 'orderDetails.promotion', 'status', 'table']
        });
        if (orders.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderRepository.findOne({
            where: { orderId: parseInt(req.params.id) },
            relations: ['orderDetails.productSize.product', 'orderDetails.productSize.size', 'orderDetails.promotion', 'status']});
        order ? res.status(200).json(order) : res.sendStatus(410)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getByTableId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderRepository.find({
            where: { table: { tableId: parseInt(req.params.id) }},
            relations: ['orderDetails'],
            order: {
                createdAt: 'DESC'
            }
        });
        order ? res.status(200).json(order) : res.sendStatus(410)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryRunner = orderRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            const order = req.body;
            const result = await queryRunner.manager.save(Order, order);

            const carts = await queryRunner.manager.find(Cart, {where: {tableId: order.tableId}})
            const orderDetails:any = [];
            for (const od of carts) {
                if (od.productSizeId) {
                    let productSize = await queryRunner.manager.findOne(ProductSize, {where: { productSizeId: od.productSizeId}});
                    if (productSize) {
                        orderDetails.push({...od, orderId: result.orderId, price: productSize.price, discount: productSize.discount})
                    }
                }

                if (od.promotionId) {
                    let promotion = await queryRunner.manager.findOne(Promotion, {where: { promotionId: od.promotionId}});
                    if (promotion) {
                        orderDetails.push({...od, orderId: result.orderId, price: promotion.price})
                    }
                }
                await queryRunner.manager.delete(Cart, od.cartId);
            }

            try {
                await queryRunner.manager.save(OrderDetail, orderDetails);
            } catch (error) {
                console.log(error);
                return res.json(error);
            }

            await queryRunner.commitTransaction();
            return res.redirect(`/orders/id/${result.orderId}`);
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            return res.status(500).json({ error: 'Transaction failed' });
        } finally {
            await queryRunner.release();
        }
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryRunner = orderRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        
        await queryRunner.startTransaction();
        try {
            const order = req.body;
            const found:any = await queryRunner.manager.findOne(Order, { where: { orderId: parseInt(req.params.id)} });           
            if (found) {
                Object.entries(order).forEach(([key, value]:any) => {
                    found[key] = value;
                });
            } else {
                return res.sendStatus(410).json(found);
            }
            await queryRunner.manager.save(found, order);
            
            if(order.orderDetails){
                await queryRunner.manager.delete(OrderDetail, {orderId: parseInt(req.params.id)});
                const orderDetails = order.orderDetails.map((pd:any) => {
                    return { ...pd, orderId: parseInt(req.params.id) };
                });
                await queryRunner.manager.save(OrderDetail, orderDetails);
            }
            await queryRunner.commitTransaction();
            const result = await orderRepository.findOne({ where: { orderId: parseInt(req.params.id)}, relations: ['orderDetails'] });
            res.status(200).send(result);
        } catch (error:any) {
            await queryRunner.rollbackTransaction();
            if(error.number == 2627) {
                const message = handleUniqueError(error);
                return res.status(400).json({ error: message });
            }
            console.log(error);
            return res.status(500).send(error);
        } finally {
            await queryRunner.release();
        }
        
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const cancel = async (req:Request, res:Response) => {
    try {
        const id = parseInt(req.params.id)
        const found = await orderRepository.findOneBy({orderId: id})
        if (!found) return res.status(410).json({error: 'not found'})
        Object.assign(found, {statusId: 13});
        await orderRepository.save(found);
        return res.sendStatus(200)
    } catch (error) {
        console.log(error);    
        return res.status(500).json({error: 'Internal server error'})
    }
} 

const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderRepository.findOneBy({ orderId: parseInt(req.params.id) });
        if (!order) {
            return res.status(410).json({ error: 'Not found' });
        }
        await orderRepository.softDelete({ orderId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const restore = async (req: Request, res: Response) => {
    try {
        const order = await orderRepository.findOne({ withDeleted: true, where: { orderId: parseInt(req.params.id), deletedAt: Not(IsNull()) } });
        if (!order) {
            return res.status(410).json({ error: 'Not found' });
        }
        await orderRepository.restore({ orderId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderRepository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) }, relations: ['orderDetails'],  order: {
                deletedAt: 'DESC'
            } });
        if (orders.length === 0) {
            return res.status(204).send({
                error: 'No content'
            });
        }
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderRepository.findOne({withDeleted:true, where: { orderId: parseInt(req.params.id), deletedAt: Not(IsNull())}});
        if (!order) {
            return res.status(410).json({ error: 'Not found' });
        }
        await orderRepository.delete({ orderId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const updateStatus = async (req:Request, res:Response) =>{
    try {
        const orderId = parseInt(req.params.id);
        const statusId = parseInt(req.body.statusId);
        const found = await orderRepository.findOneBy({orderId: orderId});
        if (!found) return res.status(410).json({error: 'not found'})

        Object.assign(found, {statusId: statusId})
        await orderRepository.save(found)
        return res.sendStatus(200)
    } catch (error) {
        console.log(error);    
        return res.status(500).json({error: 'Internal server error'})
    }
}

const getTotalPrice = async (req:Request, res:Response) => {
    try{
        const orderId = req.params.id;
        const totalPrice = await orderRepository.manager.query(`SELECT CalculateTotalPrice(${orderId})`);
        if(!totalPrice) return res.status(400)
        return res.json(totalPrice)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

export default {getAll, 
                getById,
                getByTableId,
                create, 
                update, 
                cancel,
                softDelete,
                restore,
                getDeleted, 
                hardDelete,
                updateStatus,
                getTotalPrice
            }
