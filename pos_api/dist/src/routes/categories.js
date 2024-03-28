"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const category_entity_1 = require("../entities/category.entity");
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const repository = data_source_1.AppDataSource.getRepository(category_entity_1.Category);
const router = express_1.default.Router();
/* GET categories */
router.get('/', category_controller_1.default.getAll);
/* GET category by id */
router.get('/:id', category_controller_1.default.getById);
/* POST category */
router.post('/', category_controller_1.default.create);
/* PATCH category */
router.patch('/:id', category_controller_1.default.update);
/* DELETE category */
router.delete('/:id', category_controller_1.default.softDelete);
exports.default = router;
