import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Status } from '../entities/status.entity';
import { Between } from 'typeorm';

const statusRepository = AppDataSource.getRepository(Status);


const getStatus = async (req: Request, res: Response) => {
    try {
        const feature = await req.params.feature;
        console.log(feature);	
        let status: any;
        switch (feature) {
            case 'orders':
                status = await statusRepository.find({where: {statusId: Between(10, 19)}});
                break;
            case 'users':
                status = await statusRepository.find({where: {statusId: Between(20, 29)}});
                break;
            case 'tables':
                status = await statusRepository.find({where: {statusId: Between(30, 39)}});
                break;
            case 'products':
                status = await statusRepository.find({where: {statusId: Between(40, 49)}});
                break;
            case 'promotions':
                status = await statusRepository.find({where: {statusId: Between(50, 59)}});
                break;

            default:
                return res.sendStatus(400);
        }

        return res.json(status);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

export default {getStatus}
