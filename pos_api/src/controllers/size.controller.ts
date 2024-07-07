import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Size } from '../entities/size.entity';
import { ProductSize } from '../entities/productSize.entity';


const repository = AppDataSource.getRepository(Size);
const repo = AppDataSource.getRepository(ProductSize);


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


const getByProduct = async (req:Request, res:Response) => {
	try {
		const productId = parseInt(req.params.id);
		const data = await repo.find({where: {productId: productId}, relations: ['size']})
		if(!data) return res.status(410);
		return res.json(data)
	} catch (error) {
		console.log(error);	
		return res.status(500).json({
            error: 'Internal server error' 
        })
	}
}
const getByProductSize = async (req:Request, res:Response) => {
	try {
		const productSizeId = parseInt(req.params.id);
		const data = await repo.findOne({where: {productSizeId: productSizeId}, relations: ['size', 'product']})
		if(!data) return res.status(410);
		return res.json(data)
	} catch (error) {
		console.log(error);	
		return res.status(500).json({
            error: 'Internal server error' 
        })
	}
}
export default {getSize, getByProduct, getByProductSize}
