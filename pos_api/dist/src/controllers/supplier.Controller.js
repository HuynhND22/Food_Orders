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
const supplier_entity_1 = require("../entities/supplier.entity");
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const typeorm_1 = require("typeorm");
const checkUnique_1 = __importDefault(require("../helpers/checkUnique"));
const repository = data_source_1.AppDataSource.getRepository(supplier_entity_1.Supplier);
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield repository.find();
        if (suppliers.length === 0) {
            return res.status(204).send({
                error: 'No content',
            });
        }
        return res.json(suppliers);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOneBy({ supplierId: parseInt(req.params.id) });
        supplier ? res.json(supplier) : res.sendStatus(410);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = new supplier_entity_1.Supplier();
        Object.assign(supplier, req.body);
        yield repository.save(supplier);
        return res.status(201).json(supplier);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ message: 'Not found' });
        }
        Object.assign(supplier, req.body);
        yield repository.save(supplier);
        return res.json(supplier);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOneBy({ supplierId: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(410).json({ message: 'Not found' });
        }
        yield repository.softDelete({ supplierId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield repository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (suppliers.length === 0) {
            return res.status(204).send({ message: 'No content' });
        }
        return res.json(suppliers);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const restore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield repository.findOne({ withDeleted: true, where: { supplierId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!suppliers) {
            return res.status(410).json({ message: 'Not found' });
        }
        yield repository.restore({ supplierId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const hardDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOne({ withDeleted: true, where: { supplierId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!supplier) {
            return res.sendStatus(410);
        }
        yield repository.delete({ supplierId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const checkSupplierUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, ignore, field } = req.query;
    if (ignore && ignore == value) {
        return res.sendStatus(200);
    }
    try {
        const check = yield (0, checkUnique_1.default)(supplier_entity_1.Supplier, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { getAll, getById, create, update, softDelete, getDeleted, restore, hardDelete, checkSupplierUnique };
