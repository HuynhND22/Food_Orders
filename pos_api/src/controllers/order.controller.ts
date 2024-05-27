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
        const orders = await orderRepository.find();
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

const getByTableId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderRepository.find({
            where: { tableId: parseInt(req.params.id) },
            relations: ['orderDetails']
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
                const orderDetails = [];
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
            if (result.payment == "Ngân hàng") {
                return res.redirect(`/payments/handler/${result.orderId}`);
            } else {
                return res.redirect(`/orders/id/${result.orderId}`);
            }
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
            const found = await queryRunner.manager.findOne(Order, { where: { orderId: parseInt(req.params.id)} });
            console.table(found);
            if (found) {
                found.tableId = order.tableId;
                found.userId = order.userId;
                found.statusId = order.statusId;
                found.payment = order.payment;
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
        const orders = await orderRepository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) }, relations: ['orderDetails'] });
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

export default {getAll, 
                getByTableId,
                create, 
                update, 
                softDelete,
                restore,
                getDeleted, 
                hardDelete
            }
