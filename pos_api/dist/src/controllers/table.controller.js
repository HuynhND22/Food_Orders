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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const typeorm_1 = require("typeorm");
const table_entity_1 = require("../entities/table.entity");
const convertToSimpleString_1 = require("../helpers/convertToSimpleString");
const fs_1 = require("fs");
const checkUnique_1 = __importDefault(require("../helpers/checkUnique"));
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const base64Url = require('base64-url');
const QRCode = require('qrcode');
const repository = data_source_1.AppDataSource.getRepository(table_entity_1.Table);
require('dotenv').config();
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield repository.find();
        if (tables.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(tables);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const table = yield repository.findOneBy({ tableId: parseInt(req.params.id) });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        return res.json(table);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body;
        let simpleName = (0, convertToSimpleString_1.convertToSimpleString)(req.body.name);
        const table = new table_entity_1.Table();
        data['qrCode'] = `./public/qrCodes/tables/${simpleName}.png`;
        data['uriCode'] = base64Url.encode(simpleName);
        Object.assign(table, data);
        yield repository.save(table);
        yield QRCode.toFile(`./public/upload/tables/${simpleName}.png`, `${process.env.HOST_CLIENT}/tables/${data['urlCode']}`, {
            errorCorrectionLevel: 'H'
        }, function (err) {
            if (err)
                throw err;
            console.log('QR code saved!');
        });
        return res.status(201).json(table);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const table = yield repository.findOneBy({ tableId: parseInt(req.params.id) });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        let data = req.body;
        let simpleName = (0, convertToSimpleString_1.convertToSimpleString)(req.body.name);
        if (req.body.name) {
            try {
                data['qrCode'] = `./public/upload/tables/${simpleName}.png`;
                data['urlCode'] = base64Url.encode(simpleName);
                yield QRCode.toFile(`./public/upload/tables/${simpleName}.png`, `${process.env.HOST_CLIENT}/tables/${data['urlCode']}`, {
                    errorCorrectionLevel: 'H'
                }, function (err) {
                    if (err)
                        throw err;
                    console.log('QR code saved!');
                });
                yield (0, fs_1.unlink)(table.qrCode, (err) => {
                    if (err)
                        throw err;
                    console.log('unlinked');
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
        Object.assign(table, data);
        yield repository.save(table);
        return res.json(table);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const table = yield repository.findOneBy({ tableId: parseInt(req.params.id) });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.softDelete({ tableId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield repository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (tables.length === 0) {
            return res.status(204).json({ error: 'No content' });
        }
        return res.json(tables);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const restore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const table = yield repository.findOne({ withDeleted: true, where: { tableId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.restore({ tableId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const hardDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const table = yield repository.findOne({ withDeleted: true, where: { tableId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!table) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.delete({ tableId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const checkTableUnique = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, ignore, field } = req.query;
    if (ignore && ignore == value) {
        return res.sendStatus(200);
    }
    try {
        const check = yield (0, checkUnique_1.default)(table_entity_1.Table, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = { getAll, getById, create, update, softDelete, getDeleted, restore, hardDelete, checkTableUnique };
