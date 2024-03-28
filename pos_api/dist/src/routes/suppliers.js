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
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const supplier_entity_1 = require("../entities/supplier.entity");
const router = express_1.default.Router();
const repository = data_source_1.AppDataSource.getRepository(supplier_entity_1.Supplier);
/* GET suppliers */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield repository.find();
        if (suppliers.length === 0) {
            res.status(204).send();
        }
        else {
            res.json(suppliers);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
/* GET supplier by id */
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOneBy({ id: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(supplier);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
/* POST supplier */
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = new supplier_entity_1.Supplier();
        Object.assign(supplier, req.body);
        yield repository.save(supplier);
        res.status(201).json(supplier);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
/* PATCH supplier */
router.patch('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOneBy({ id: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(404).json({ error: 'Not found' });
        }
        Object.assign(supplier, req.body);
        yield repository.save(supplier);
        const updatedCategory = yield repository.findOneBy({ id: parseInt(req.params.id) });
        res.json(updatedCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
/* DELETE supplier */
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield repository.findOneBy({ id: parseInt(req.params.id) });
        if (!supplier) {
            return res.status(404).json({ error: 'Not found' });
        }
        yield repository.delete({ id: supplier.id });
        res.status(200).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
