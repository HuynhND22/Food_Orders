import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Province } from '../entities/province.entity';
import { District } from '../entities/district.entity';
import { Ward } from '../entities/ward.entity';

const provinceRepository = AppDataSource.getRepository(Province);
const districtRepository = AppDataSource.getRepository(District);
const wardRepository = AppDataSource.getRepository(Ward);

const getProvinces = async (req: Request, res: Response) => {
    try {
        const provinces = await provinceRepository.find({
            order: {
                name: 'ASC'
            }
        });
        if (provinces.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(provinces);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

const getDistricts = async (req: Request, res: Response) => {
    try {
        const districts = await districtRepository.find({where: {provinceId: parseInt(req.params.provinceId)}, order: {
                name: 'ASC'
            }});
        if (districts.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(districts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

const getWards = async (req: Request, res: Response) => {
    try {
        const wards = await wardRepository.find({where: {districtId: parseInt(req.params.districtId)}, relations: ['district.province'], order: {
                name: 'ASC'
            }});
        if (wards.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(wards);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error' 
        })
    }
}

export default {getProvinces, getDistricts, getWards}
