import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Supplier } from '../entities/supplier.entity';
import { handleUniqueError } from '../helpers/handleUniqueError';
import { IsNull, Not } from 'typeorm';
import checkUnique from '../helpers/checkUnique';

const repository = AppDataSource.getRepository(Supplier);


const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suppliers = await repository.find({relations: ['ward.district.province']});
    if (suppliers.length === 0) {
        return res.status(204).send({
          error: 'No content',
        });
    }
    return res.json(suppliers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await repository.findOne({where: {supplierId: parseInt(req.params.id)}, relations: ['ward.district.province']});
        supplier ? res.json(supplier) : res.sendStatus(410);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = new Supplier();
        Object.assign(supplier, req.body);
    
        await repository.save(supplier);
        return res.status(201).json(supplier);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ message: 'Not found' });
        }
    
        Object.assign(supplier, req.body);
        await repository.save(supplier);
        return res.json(supplier);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ message: 'Not found' });
        }
        await repository.softDelete({ supplierId: parseInt(req.params.id)});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const suppliers = await repository.find({withDeleted: true, where: {deletedAt: Not(IsNull())}, relations: ['ward.district.province']});
        if (suppliers.length === 0) {
            return res.status(204).send({message: 'No content'});
        }
        return res.json(suppliers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const suppliers = await repository.findOne({withDeleted: true, where: {supplierId: parseInt(req.params.id), deletedAt: Not(IsNull())}})
        if (!suppliers) {
            return res.status(410).json({ message: 'Not found' });
        }        
        await repository.restore({supplierId: parseInt(req.params.id)});
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await repository.findOne({ withDeleted:true, where: { supplierId: parseInt(req.params.id), deletedAt: Not(IsNull())} });
        if (!supplier) {
            return res.sendStatus(410)
        }
        await repository.delete({ supplierId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const checkSupplierUnique = async (req: Request, res: Response, next: NextFunction) => {
    const {value, ignore, field} = req.query;
  
    if(ignore && ignore == value) {
        return res.sendStatus(200)
    }

    try {
        const check = await checkUnique(Supplier, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default {getAll, getById, create, update, softDelete, getDeleted, restore, hardDelete, checkSupplierUnique}
