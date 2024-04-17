import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Category } from '../entities/category.entity';
import { IsNull, Not } from 'typeorm';
import checkUnique from '../helpers/checkUnique';

const repository = AppDataSource.getRepository(Category);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error: any) {
      if(error.number === 2627) {
        return res.status(400).json({ error: 'Category already exists' });
      }
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
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
      await repository.softDelete({ categoryId: parseInt(req.params.id) });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await repository.find({ withDeleted: true, where: {deletedAt: Not(IsNull())} });
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

const restore = async (req: Request, res: Response, next: any) => {
    try {
      const category = await repository.findOne({ withDeleted: true, where: { categoryId: parseInt(req.params.id) }});
      if (!category) {
        return res.status(410).json({ error: 'Not found' });
      }
      await repository.restore({ categoryId: parseInt(req.params.id) });
      res.status(200).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const hardDelete = async (req: Request, res: Response) => {
  try {
    const category = await repository.findOne({withDeleted: true, where: {categoryId: parseInt(req.params.id), deletedAt: Not(IsNull())} });
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

const checkNameUnique = async (req:Request, res:Response) => {
  if(!!req.query.oldName && req.query.oldName == req.query.name) {
    return res.sendStatus(200)
  }

  const check = await checkUnique(Category, 'name', req.query.name);
  try {
    if(!check) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default {getAll, getById, getDeleted, create, update, softDelete, restore, hardDelete, checkNameUnique}
