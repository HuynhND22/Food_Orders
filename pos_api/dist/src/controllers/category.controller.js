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
const category_entity_1 = require("../entities/category.entity");
const typeorm_1 = require("typeorm");
const checkUnique_1 = __importDefault(require("../helpers/checkUnique"));
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const repository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield repository.find();
        if (categories.length === 0) {
            res.status(204).send({
                error: 'No content',
            });
        }
        return res.json(categories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield repository.findOneBy({ categoryId: parseInt(req.params.id) });
        category ? res.json(category) : res.status(410);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = new category_entity_1.Category();
        Object.assign(category, req.body);
        yield repository.save(category);
        res.status(201).json(category);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield repository.findOneBy({ categoryId: parseInt(req.params.id) });
        if (!category) {
            return res.status(410).json({ error: 'Not found' });
        }
        Object.assign(category, req.body);
        yield repository.save(category);
        const updatedCategory = yield repository.findOneBy({ categoryId: parseInt(req.params.id) });
        res.json(updatedCategory);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield repository.findOneBy({ categoryId: parseInt(req.params.id) });
        if (!category) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.softDelete({ categoryId: parseInt(req.params.id) });
        res.status(200).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield repository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (categories.length === 0) {
            res.status(204).send({
                error: 'No content',
            });
        }
        else {
            res.json(categories);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const restore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield repository.findOne({ withDeleted: true, where: { categoryId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!category) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.restore({ categoryId: parseInt(req.params.id) });
        res.status(200).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const hardDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield repository.findOne({ withDeleted: true, where: { categoryId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!category) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.delete({ categoryId: parseInt(req.params.id) });
        res.status(200).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const checkCategoryUnique = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, ignore, field } = req.query;
    if (ignore && ignore == value) {
        return res.sendStatus(200);
    }
    try {
        const check = yield (0, checkUnique_1.default)(category_entity_1.Category, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = { getAll, getById, getDeleted, create, update, softDelete, restore, hardDelete, checkCategoryUnique };
