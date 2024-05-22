"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const ordersValidator_1 = __importDefault(require("../middleware/validators/ordersValidator"));
const router = express_1.default.Router();
router.get('/all', order_controller_1.default.getAll);
router.get('/id/:id', order_controller_1.default.getById);
router.post('/create/', ordersValidator_1.default, order_controller_1.default.create);
router.put('/update/:id', ordersValidator_1.default, order_controller_1.default.update);
router.delete('/remove/:id', order_controller_1.default.softDelete);
router.get('/deleted/', order_controller_1.default.getDeleted);
router.post('/restore/:id', order_controller_1.default.restore);
// router.delete('/delete/:id', orderController.hardDelete);
exports.default = router;
