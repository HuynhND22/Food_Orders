"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = __importDefault(require("../controllers/cart.controller"));
const cartsValidator_1 = __importDefault(require("../middleware/validators/cartsValidator"));
const router = express_1.default.Router();
router.get('/id/:tableId', cart_controller_1.default.getByTableId);
router.post('/create/', cartsValidator_1.default, cart_controller_1.default.create);
router.patch('/update/:id', cart_controller_1.default.update);
router.delete('/delete/:tableId', cart_controller_1.default.hardDelete);
exports.default = router;
