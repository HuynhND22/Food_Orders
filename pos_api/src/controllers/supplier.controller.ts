import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Supplier } from '../entities/supplier.entity';
import { IsNull, Not } from 'typeorm';
import checkUnique from '../helpers/checkUnique';

const repository = AppDataSource.getRepository(Supplier);

// get all supplier
const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const suppliers = await repository.find();
        if (suppliers.length === 0) {
            res.status(204).send({
                error: 'No content',
            });
        } else {
            res.json(suppliers);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get by id supplier
const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ error: 'Not found' });
        }
        res.json(supplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

 //create supplier
 const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = new Supplier();
        Object.assign(supplier, req.body);

        await repository.save(supplier);
        res.status(201).json(supplier);
     } catch (error: any) {
        if (error.number === 2627) {
             return res.status(400).json({ error: 'Supplier already exists' });
        } else if (error.number === 5000) {
             return res.status(400).json({ error: 'Custom error message for error 5000' });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
     }
 }
//  const  create = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const supplier = new Supplier();
//       Object.assign(supplier, req.body);
//       await repository.save(supplier);
//       res.status(201).json(supplier);
//     } catch (error) {
//      console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//    };
// update method
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const supplier = await repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ error: 'Not found' });
        }

        Object.assign(supplier, req.body); // copy
        await repository.save(supplier);
        const updatedSupplier = await repository.findOneBy({ supplierId: parseInt(req.params.id) });
        res.json(updatedSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const softDelete = async (req: Request, res: Response, next: any) => {
    try {
        const supplier = await repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.softDelete({ supplierId: parseInt(req.params.id) });
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const suppliers = await repository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) } });
        if (suppliers.length === 0) {
            res.status(204).send({
                error: 'No content',
            });
        } else {
            res.json(suppliers);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const restore = async (req: Request, res: Response, next: any) => {
    try {
        const supplier = await repository.findOne({ withDeleted: true, where: { supplierId: parseInt(req.params.id) } });
        if (!supplier) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.restore({ supplierId: parseInt(req.params.id) });
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const hardDelete = async (req: Request, res: Response) => {
    try {
        const supplier = await repository.findOne({ withDeleted: true, where: { supplierId: parseInt(req.params.id), deletedAt: Not(IsNull()) } });
        if (!supplier) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.delete({ supplierId: parseInt(req.params.id) });
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const checkNameUnique = async (req: Request, res: Response) => {
    if (!!req.query.oldName && req.query.oldName == req.query.name) {
        return res.sendStatus(200)
    }

    const check = await checkUnique(Supplier, 'name', req.query.name);
    try {
        if (!check) {
            return res.sendStatus(400)
        }
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const checkPhoneNumberUnique = async (req: Request, res: Response) => {
    if (!!req.query.oldName && req.query.oldName == req.query.phoneNumber) {
        return res.sendStatus(200)
    }

    const check = await checkUnique(Supplier, 'phoneNumber', req.query.phoneNumber);
    try {
        if (!check) {
            return res.sendStatus(400)
        }
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const checkEmailUnique = async (req: Request, res: Response) => {
    if (!!req.query.oldName && req.query.oldName == req.query.email) {
        return res.sendStatus(200)
    }

    const check = await checkUnique(Supplier, 'email', req.query.email);
    try {
        if (!check) {
            return res.sendStatus(400)
        }
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default { getAll, getById, getDeleted, create, update, softDelete, restore, hardDelete, checkNameUnique, checkPhoneNumberUnique, checkEmailUnique };
