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
const product_entity_1 = require("../entities/product.entity");
const category_view_entity_1 = require("../entities/views/category-view.entity");
const router = express_1.default.Router();
const repository = data_source_1.AppDataSource.getRepository(product_entity_1.Product);
const viewRepository = data_source_1.AppDataSource.getRepository(category_view_entity_1.CategoryView);
// Gọi 1 câu lệnh SQL trực tiếp
router.get('/call-raw-sql', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield repository.manager.connection.query('SELECT * FROM Orders AS O WHERE O.Id = @0', [1]);
        // res.json(results);
        res.json(toCamelCase(results));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Call store procedure
router.get('/call-stored-procedure', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield repository.manager.connection.query('EXECUTE [dbo].[usp_Products_GetByDiscount] @0', [5]);
        res.json(toCamelCase(results));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/get-all-orders', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield repository.manager.connection.query('EXECUTE [dbo].[usp_Orders_GetAll]', []);
        res.json(toCamelCase(results));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Call store procedure
router.get('/customers/get-by-year-of-birthday/:year', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield repository.manager.connection.query('EXECUTE [dbo].[usp_Customers_GetByYearOfBirth] @0', [req.params.year]);
        res.json(toCamelCase(results));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/view', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield viewRepository.find();
        if (categories.length === 0) {
            res.status(204).send();
        }
        else {
            res.json(categories);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
function toCamelCase(o) {
    var newO = {}, origKey, newKey, value;
    if (o instanceof Array) {
        return o.map(function (value) {
            if (typeof value === 'object') {
                value = toCamelCase(value);
            }
            return value;
        });
    }
    else {
        for (origKey in o) {
            if (o.hasOwnProperty(origKey)) {
                newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                value = o[origKey];
                if (value instanceof Array || (value !== null && value.constructor === Object)) {
                    value = toCamelCase(value);
                }
                newO[newKey] = value;
            }
        }
    }
    return newO;
}
exports.default = router;
