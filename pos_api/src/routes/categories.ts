import express, { NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Category } from '../entities/category.entity';

import categoryController from '../controllers/category.controller';

const repository = AppDataSource.getRepository(Category);

const router = express.Router();

/* GET categories */
router.get('/', categoryController.getAll);

/* GET category by id */
router.get('/:id', categoryController.getById);

/* POST category */
router.post('/', categoryController.create);

/* PATCH category */
router.patch('/:id', categoryController.update);

/* DELETE category */
router.delete('/:id', categoryController.softDelete);

export default router;
