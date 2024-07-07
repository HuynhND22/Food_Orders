import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Promotion } from "../entities/promotion.entity";
import { PromotionDetail } from "../entities/promotionDetail.entity";
import { IsNull, Not } from "typeorm";
import checkUnique from "../helpers/checkUnique";
import { handleUniqueError } from "../helpers/handleUniqueError";

const promotionRepository = AppDataSource.getRepository(Promotion);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotions = await promotionRepository.find({ relations: ['promotionDetails.productSize.product.images', 'promotionDetails.productSize.size'], order: {createdAt: 'DESC'} });
    //     const promotions = await promotionRepository.createQueryBuilder('promotion')
    // .leftJoinAndSelect('promotion.promotionDetails', 'promotionDetail')
    // .leftJoinAndSelect('promotionDetail.productSize', 'productSize')
    // .leftJoinAndSelect('productSize.product', 'product', 'product.deletedAt IS NULL')
    // .leftJoinAndSelect('productSize.size', 'size')
    // .getMany();
    // promotions.forEach(promotion => {
    // promotion.promotionDetails = promotion.promotionDetails.filter(detail => detail.productSize.product !== null);
    // });
    promotions.forEach(promotion => {
        promotion.promotionDetails = promotion.promotionDetails.filter(detail => detail.productSize.product !== null);
        promotion.promotionDetails.forEach(detail => {
            if (detail.productSize.product) {
                detail.productSize.product.images = detail.productSize.product.images.filter(image => image.cover === true);
            }
        });
    });
        if (promotions.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(promotions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotion = await promotionRepository.findOne({ 
            where: { promotionId: parseInt(req.params.id), statusId: 51 },
            relations: ['promotionDetails']
        });
        promotion ? res.status(200).json(promotion) : res.sendStatus(410)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryRunner = promotionRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();

        await queryRunner.startTransaction();
        try {
            const promotion = req.body;
            console.log(promotion)
            try {

                const result = await queryRunner.manager.save(Promotion, promotion);
                const promotionDetails = promotion.promotionDetail.map((pd:any) => {
                    return { ...pd, promotionId: result.promotionId };
                });
                await queryRunner.manager.save(PromotionDetail, promotionDetails);
            } catch (e) {
                console.log('avs ', e);    
            }
            await queryRunner.commitTransaction();

            res.sendStatus(200)

        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).json({ error: 'Transaction failed' });
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
        const queryRunner = promotionRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        
        await queryRunner.startTransaction();
        try {
            const promotion = req.body
            const found:any = await queryRunner.manager.findOne(Promotion, { where: { promotionId: parseInt(req.params.id)} });
            if(!found) return res.sendStatus(410);

            Object.entries(promotion).forEach(([key, value]:any) => {
                found[key] = value;
            });
            
            await queryRunner.manager.save(found, promotion);
            
            if(promotion.promotionDetails){
                await queryRunner.manager.delete(PromotionDetail, {promotionId: parseInt(req.params.id)})
                const promotionDetails = promotion.promotionDetails.map((pd:any) => {
                    return { ...pd, promotionId: parseInt(req.params.id) };
                });
                await queryRunner.manager.save(PromotionDetail, promotionDetails);
            }
            await queryRunner.commitTransaction();
            const result = await promotionRepository.findOne({ where: { promotionId: parseInt(req.params.id)}, relations: ['promotionDetails'] })
            res.status(200).send(result)
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
        const promotion = await promotionRepository.findOneBy({ promotionId: parseInt(req.params.id) });
        if (!promotion) {
            return res.status(410).json({ error: 'Not found' });
        }
        await promotionRepository.softDelete({ promotionId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const restore = async (req: Request, res: Response) => {
    try {
        const promotion = await promotionRepository.findOne({ withDeleted: true, where: { promotionId: parseInt(req.params.id), deletedAt: Not(IsNull()) } });
        if (!promotion) {
            return res.status(410).json({ error: 'Not found' });
        }
        await promotionRepository.restore({ promotionId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotions = await promotionRepository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) }, relations: ['promotionDetails.productSize.product', 'promotionDetails.productSize.size'] });
        if (promotions.length === 0) {
            return res.status(204).send({
                error: 'No content'
            });
        }
        res.json(promotions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotion = await promotionRepository.findOne({withDeleted:true, where: { promotionId: parseInt(req.params.id), deletedAt: Not(IsNull())}});
        if (!promotion) {
            return res.status(410).json({ error: 'Not found' });
        }
        await promotionRepository.delete({ promotionId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const checkPromotionUnique = async (req: Request, res: Response, next: NextFunction) => {
    const {value, ignore, field} = req.query;
  
    if(ignore && ignore === value) {
      return res.sendStatus(200)
    }

    try {
        const check = await checkUnique(Promotion, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } 
}

const client = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const promotions = await promotionRepository.find({where: {statusId: 51}, relations: ['promotionDetails.productSize.product.images', 'promotionDetails.productSize.size'],order: {createdAt: 'DESC'} });
        promotions.forEach(promotion => {
            promotion.promotionDetails = promotion.promotionDetails.filter(detail => detail.productSize.product !== null);
            promotion.promotionDetails.forEach(detail => {
                if (detail.productSize.product) {
                    detail.productSize.product.images = detail.productSize.product.images.filter(image => image.cover === true);
                }
            });
        });
        if (promotions.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(promotions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

export default {getAll, 
                getById,
                create, 
                update, 
                softDelete,
                restore,
                getDeleted, 
                hardDelete, 
                checkPromotionUnique,
                client
            }
