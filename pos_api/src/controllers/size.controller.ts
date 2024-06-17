import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Size } from '../entities/size.entity';


const repository = AppDataSource.getRepository(Size);


const getSize = async (req: Request, res: Response) => {
    try {
        const data = await repository.find();
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

export default {getSize}
