import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Order } from '../entities/order.entity';
import { District } from '../entities/district.entity';
import { Ward } from '../entities/ward.entity';
import { Between } from 'typeorm';

const orderRepository = AppDataSource.getRepository(Order);
const districtRepository = AppDataSource.getRepository(District);
const wardRepository = AppDataSource.getRepository(Ward);

const getOrderByDate = async (req: Request, res: Response) => {
    try {
        const {from, to } = req.query
        const result = await orderRepository
            .createQueryBuilder('od')
            .select("CONVERT(DATE, od.createdAt)", "date")
            .addSelect("COUNT(od.orderId)", "totalOrders")
            .where("od.createdAt BETWEEN :startDate AND :endDate")
            .setParameter('startDate', from)
            .setParameter('endDate', to)
            .andWhere("od.deletedAt IS NULL")
            .groupBy("CONVERT(DATE, od.createdAt)")
            .orderBy("date", "ASC")
            .getRawMany();

        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

const getStatusOrderByDate = async (req: Request, res: Response) => {
    try {
        const {from, to } = req.query
          const result = await orderRepository
            .createQueryBuilder('od')
            .select("od.statusId", "statusId")
            .addSelect("COUNT(od.orderId)", "count")
            .where("od.createdAt BETWEEN :startDate AND :endDate")
            .setParameter('startDate', from)
            .setParameter('endDate', to)
            .andWhere("od.deletedAt IS NULL")
            .groupBy("od.statusId")
            .orderBy("od.statusId", "ASC")
            .getRawMany();

        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}


export default {getOrderByDate, getStatusOrderByDate}
