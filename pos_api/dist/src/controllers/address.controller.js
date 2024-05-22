"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const province_entity_1 = require("../entities/province.entity");
const district_entity_1 = require("../entities/district.entity");
const ward_entity_1 = require("../entities/ward.entity");
const provinceRepository = data_source_1.AppDataSource.getRepository(province_entity_1.Province);
const districtRepository = data_source_1.AppDataSource.getRepository(district_entity_1.District);
const wardRepository = data_source_1.AppDataSource.getRepository(ward_entity_1.Ward);
const getProvinces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provinces = yield provinceRepository.find();
        if (provinces.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(provinces);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
const getDistricts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const districts = yield districtRepository.find({ where: { provinceId: parseInt(req.params.provinceId) } });
        if (districts.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(districts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
const getWards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wards = yield wardRepository.find({ where: { districtId: parseInt(req.params.districtId) } });
        if (wards.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(wards);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.default = { getProvinces, getDistricts, getWards };
