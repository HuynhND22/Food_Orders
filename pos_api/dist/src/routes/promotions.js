"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promotion_controller_1 = __importDefault(require("../controllers/promotion.controller"));
const promotionsValidator_1 = __importDefault(require("../middleware/validators/promotionsValidator"));
const router = express_1.default.Router();
router.get('/all', promotion_controller_1.default.getAll);
router.get('/id/:id', promotion_controller_1.default.getById);
router.post('/create/', promotionsValidator_1.default, promotion_controller_1.default.create);
router.patch('/update/:id', promotionsValidator_1.default, promotion_controller_1.default.update);
router.delete('/remove/:id', promotion_controller_1.default.softDelete);
router.get('/deleted/', promotion_controller_1.default.getDeleted);
router.post('/restore/:id', promotion_controller_1.default.restore);
router.delete('/delete/:id', promotion_controller_1.default.hardDelete);
router.get('/check/unique', promotion_controller_1.default.checkPromotionUnique);
exports.default = router;
