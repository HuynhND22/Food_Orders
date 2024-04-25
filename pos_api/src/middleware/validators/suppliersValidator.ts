import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const supplierSchema = object().shape({
    name: string().required('Name must be required'),
    email: string().email().required('Email must be requied'),
    phoneNumber: string().max(15),
    address:  string().required('Address must be required'),
    description: string().notRequired(),
    wardId: number().nullable(),
    statusId : number().nullable(),
    createdAt:string()  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .required('AcreatAt must be required')
    .default(() => new Date().toISOString().slice(0, 10)),
    updatedAt: string()  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .notRequired()
    .default(() => new Date().toISOString().slice(0, 10)),
    deletedAt: string()  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')
    .notRequired()
    .default(() => new Date().toISOString().slice(0, 10)),
  });
  

const validateSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await supplierSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateSupplier;