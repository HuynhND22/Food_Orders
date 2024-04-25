import {number, object, string} from 'yup';
import { Request, Response, NextFunction } from "express";

const categorySchema = object().shape({
    name: string().required('Name must be required').max(255),
    seat: number().required('Seat must be required').max(50, 'Maximun of seat is 50'),
    statusId: number().required('StatusId must be required'),
    description: string().notRequired()
  });

const validateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categorySchema.validate(req.body, {abortEarly: false});
        next();
    } catch (error:any) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
}

export default validateCategory;
