"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const categoriesValidator_1 = __importDefault(require("../middleware/validators/categoriesValidator"));
const router = express_1.default.Router();
router.get('/all', category_controller_1.default.getAll);
router.get('/id/:id', category_controller_1.default.getById);
router.post('/create/', categoriesValidator_1.default, category_controller_1.default.create);
router.patch('/update/:id', categoriesValidator_1.default, category_controller_1.default.update);
router.delete('/remove/:id', category_controller_1.default.softDelete);
router.get('/deleted/', category_controller_1.default.getDeleted);
router.post('/restore/:id', category_controller_1.default.restore);
router.delete('/delete/:id', category_controller_1.default.hardDelete);
router.get('/check/unique', category_controller_1.default.checkCategoryUnique);
exports.default = router;
