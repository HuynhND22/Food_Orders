"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplier_Controller_1 = __importDefault(require("../controllers/supplier.Controller"));
const suppliersValidator_1 = __importDefault(require("../middleware/validators/suppliersValidator"));
const router = express_1.default.Router();
router.get('/all', supplier_Controller_1.default.getAll);
router.get('/id/:id', supplier_Controller_1.default.getById);
router.post('/create/', suppliersValidator_1.default, supplier_Controller_1.default.create);
router.patch('/update/:id', suppliersValidator_1.default, supplier_Controller_1.default.update);
router.delete('/remove/:id', supplier_Controller_1.default.softDelete);
router.get('/deleted/', supplier_Controller_1.default.getDeleted);
router.post('/restore/:id', supplier_Controller_1.default.restore);
router.delete('/delete/:id', supplier_Controller_1.default.hardDelete);
router.get('/check/unique', supplier_Controller_1.default.checkSupplierUnique);
exports.default = router;
