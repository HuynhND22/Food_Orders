import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { IsNull, Not } from 'typeorm';
import { Table } from '../entities/table.entity';
import { convertToSimpleString } from '../helpers/convertToSimpleString';
import {unlink} from 'fs';
import checkUnique from '../helpers/checkUnique';
import { handleUniqueError } from '../helpers/handleUniqueError';

const base64Url = require('base64-url');
const QRCode = require('qrcode');

const repository = AppDataSource.getRepository(Table);
require('dotenv').config()

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tables = await repository.find();
        if (tables.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(tables);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const table = await repository.findOneBy({ tableId: parseInt(req.params.id) });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        return res.json(table);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data = req.body;
        let simpleName = convertToSimpleString(req.body.name);
        const table = new Table();
        data['qrCode'] =  `./public/qrCodes/tables/${simpleName}.png`;
        data['uriCode'] =  base64Url.encode(simpleName);

        Object.assign(table, data);
        await repository.save(table);

        await QRCode.toFile(`./public/qrCodes/tables/${simpleName}.png`, process.env.HOST_CLIENT + `/tables/${data['urlCode']}`, {
            errorCorrectionLevel: 'H'
          }, function(err:any) {
            if (err) throw err;
            console.log('QR code saved!');
          });


        return res.status(201).json(table);
    } catch (error: any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const table = await repository.findOneBy({ tableId: parseInt(req.params.id) });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }

        let data = req.body;
        let simpleName = convertToSimpleString(req.body.name);

        if(req.body.name) {
            try {
                data['qrCode'] =  `./public/upload/tables/${simpleName}.png`;
                data['urlCode'] =  base64Url.encode(simpleName);
                await QRCode.toFile(`./public/upload/tables/${simpleName}.png`, process.env.HOST_CLIENT + `/tables/${data['urlCode']}`, {
                    errorCorrectionLevel: 'H'
                  }, function(err:any) {
                    if (err) throw err;
                    console.log('QR code saved!');
                  });
                await unlink(table.qrCode, (err) => {
                    if(err) throw err;
                    console.log('unlinked');
                })
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });   
            }
            
        }
        
        Object.assign(table, data);
        await repository.save(table);
        return res.json(table);
    } catch (error:any) {
        if(error.number == 2627) {
            const message = handleUniqueError(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const table = await repository.findOneBy({ tableId: parseInt(req.params.id) });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.softDelete({ tableId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getDeleted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tables = await repository.find({ withDeleted: true, where: { deletedAt: Not(IsNull()) } });
        if (tables.length === 0) {
            return res.status(204).json({ error: 'No content' });
        }
        return res.json(tables);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const table = await repository.findOne({ withDeleted: true, where: {tableId: parseInt(req.params.id), deletedAt: Not(IsNull()) } });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.restore({ tableId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const table = await repository.findOne({ withDeleted: true, where: {tableId: parseInt(req.params.id), deletedAt: Not(IsNull())} });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        await repository.delete({ tableId: parseInt(req.params.id) });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const checkTableUnique = async (req:Request, res:Response) => {
    const {value, ignore, field} = req.query;
  
    if(ignore && ignore == value) {
      return res.sendStatus(200)
    }
    
    try {
        const check = await checkUnique(Table, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {getAll, getById, create, update, softDelete, getDeleted, restore, hardDelete, checkTableUnique}
