import express, { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/category.entity';

const repository = AppDataSource.getRepository(Category);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('cads')
      const categories = await repository.find();
      if (categories.length === 0) {
        res.status(204).send({
          error: 'No content',
        });
      } else {
        res.json(categories);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = new Category();
      Object.assign(category, req.body);
  
      await repository.save(category);
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  }

const update =async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
  
      Object.assign(category, req.body);
      await repository.save(category);
  
      const updatedCategory = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      res.json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const softDelete = async (req: Request, res: Response, next: any) => {
    try {
      const category = await repository.findOneBy({ categoryId: parseInt(req.params.id) });
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
      await repository.delete({ categoryId: parseInt(req.params.id) });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

export default {getAll, getById, create, update, softDelete}
