import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const bankSchema = object().shape({
    username: string().required('Username must be required'),
    password: string().required('password must be required'),
  });

const validateBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await bankSchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateBank;
