"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
// import validateProduct from '../middleware/validators/productsValidator';
const router = express_1.default.Router();
router.get('/all', product_controller_1.default.getAll);
router.get('/id/:id', product_controller_1.default.getById);
router.post('/create/', product_controller_1.default.create);
router.patch('/update/:id', product_controller_1.default.update);
router.delete('/remove/:id', product_controller_1.default.softDelete);
router.get('/deleted/', product_controller_1.default.getDeleted);
router.post('/restore/:id', product_controller_1.default.restore);
// router.delete('/delete/:id', productController.hardDelete);
router.get('/check/unique', product_controller_1.default.checkProductUnique);
exports.default = router;
