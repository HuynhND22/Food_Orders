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
const product_entity_1 = require("../entities/product.entity");
const image_entity_1 = require("../entities/image.entity");
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const productSize_entity_1 = require("../entities/productSize.entity");
const fs_1 = require("fs");
const typeorm_1 = require("typeorm");
const checkUnique_1 = __importDefault(require("../helpers/checkUnique"));
// import { upload } from "../helpers/uploadFile";
const multer = require('multer');
const path = require('path');
const repository = data_source_1.AppDataSource.getRepository(product_entity_1.Product);
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield repository.find();
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield repository.findOne({
            where: { productId: parseInt(req.params.id) },
            relations: ['category', 'supplier', 'status', 'productSizes.size', 'images'],
        });
        product ? res.status(200).json(product) : res.sendStatus(410);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const queryRunner = repository.manager.connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        // console.log(req.body)
        try {
            const product = req.body;
            const result = yield queryRunner.manager.save(product_entity_1.Product, product);
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    return cb(null, path.join(__dirname, '../../public/uploads/products/'));
                },
                filename: function (req, file, cb) {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        const images = (_a = product.images) === null || _a === void 0 ? void 0 : _a.map((img) => {
                            return Object.assign(Object.assign({}, img), { productId: result.productId, uri: '/uploads/products/' });
                        });
                        yield queryRunner.manager.save(image_entity_1.Image, images);
                        return cb(null, Date.now() + path.extname(file.originalname));
                    });
                },
            });
            const upload = multer({ storage: storage }).array("images", 5);
            yield upload(req, res, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('upload ok');
                }
            });
            const sizes = yield ((_a = product.sizes) === null || _a === void 0 ? void 0 : _a.map((size) => {
                return Object.assign(Object.assign({}, size), { productId: result.productId });
            }));
            console.log(sizes);
            yield queryRunner.manager.save(productSize_entity_1.ProductSize, sizes);
            yield queryRunner.commitTransaction();
            const success = yield repository.findOne({ where: { productId: result.productId }, relations: ['category', 'supplier', 'status', 'productSizes.size', 'images'] });
            console.log(success);
            return res.status(200).json(success);
        }
        catch (error) {
            if (error.number == 2627) {
                const message = (0, handleUniqueError_1.handleUniqueError)(error);
                return res.status(400).json({ error: message });
            }
            console.log(error);
            return res.status(500).json({ error: "Transaction failed" });
        }
        finally {
            yield queryRunner.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryRunner = repository.manager.connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            const productId = parseInt(req.params.id);
            const data = req.body;
            const product = yield queryRunner.manager.findOne(product_entity_1.Product, { where: { productId: productId } });
            if (!product)
                return res.sendStatus(410);
            Object.entries(data).forEach(([key, value]) => {
                product[key] = value;
            });
            yield queryRunner.manager.save(product_entity_1.Product, product);
            const image = yield queryRunner.manager.find(image_entity_1.Image, { where: { productId: productId } });
            // console.log(image);	
            if (data.images) {
                Object.entries(image).forEach(([key, value]) => {
                    let a = data.images.find((img) => img.uri == value.uri);
                    if (!a) {
                        queryRunner.manager.delete(image_entity_1.Image, { uri: value.uri });
                        (0, fs_1.unlink)(value.uri, (err) => {
                            if (err)
                                throw err;
                        });
                    }
                });
            }
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    return cb(null, path.join(__dirname, '../../public/uploads/products/'));
                },
                filename: function (req, file, cb) {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        const images = (_a = product.images) === null || _a === void 0 ? void 0 : _a.map((img) => {
                            return Object.assign(Object.assign({}, img), { productId: productId, uri: '/uploads/products/' });
                        });
                        yield queryRunner.manager.save(image_entity_1.Image, images);
                        return cb(null, Date.now() + path.extname(file.originalname));
                    });
                },
            });
            const upload = multer({ storage: storage }).array("images", 5);
            yield upload(req, res, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('upload ok');
                }
            });
            if (data.sizes) {
                const currentSizes = yield queryRunner.manager.find(productSize_entity_1.ProductSize, { where: { productId } });
                yield Promise.all(currentSizes.map((size) => __awaiter(void 0, void 0, void 0, function* () {
                    const matchingItem = data.sizes.find((item) => item.productSizeId === size.productSizeId);
                    if (matchingItem) {
                        yield queryRunner.manager.save(productSize_entity_1.ProductSize, matchingItem);
                    }
                    else {
                        yield queryRunner.manager.softDelete(productSize_entity_1.ProductSize, size.productSizeId);
                    }
                })));
                yield Promise.all(data.sizes.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!currentSizes.some((size) => size.productSizeId === item.productSizeId)) {
                        let newSize = Object.assign(Object.assign({}, item), { productId: productId });
                        yield queryRunner.manager.save(productSize_entity_1.ProductSize, newSize);
                    }
                })));
            }
            yield queryRunner.commitTransaction();
            const success = yield repository.findOne({ where: { productId: productId }, relations: ['category', 'supplier', 'status', 'productSizes.size', 'images'] });
            console.log(success);
            return res.status(200).json(success);
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            if (error.number == 2627) {
                const message = (0, handleUniqueError_1.handleUniqueError)(error);
                return res.status(400).json({ error: message });
            }
            console.log(error);
            return res.status(500).json({ error: "Transaction failed" });
        }
        finally {
            yield queryRunner.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const found = yield repository.findOneBy({ productId: productId });
        if (!found)
            return res.status(410).json('Product not found');
        yield repository.softDelete({ productId: productId });
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const restore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.productId);
        const found = yield repository.findOne({ where: { productId: productId, deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }, withDeleted: true, });
        if (!found)
            return res.status(410).json('Product not found');
        yield repository.restore({ productId: productId });
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield repository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const checkProductUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, ignore, field } = req.query;
    if (ignore && ignore == value) {
        return res.sendStatus(200);
    }
    try {
        const check = yield (0, checkUnique_1.default)(product_entity_1.Product, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = { getAll, getById, create, update, softDelete, restore, getDeleted, checkProductUnique };
