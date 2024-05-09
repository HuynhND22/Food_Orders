import { Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";

const repository = AppDataSource.getRepository(Product);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await repository.find();
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const product = await repository.findOne({ 
            where: { productId: parseInt(req.params.id) },
            relations: ['category', 'supplier', 'status', 'productSizes.size', 'images']
        });
        product ? res.status(200).json(product) : res.sendStatus(410)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => { 

}

export default {getAll, getById}
