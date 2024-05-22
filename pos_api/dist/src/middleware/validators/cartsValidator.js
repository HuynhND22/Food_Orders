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
Object.defineProperty(exports, "__esModule", { value: true });
const yup_1 = require("yup");
const cartSchema = (0, yup_1.object)().shape({
    tableId: (0, yup_1.number)().required('TableId must be required').typeError('TableId must be a number'),
    productSizeId: (0, yup_1.number)().notRequired().typeError('ProductSize must be a number'),
    promotionId: (0, yup_1.number)().notRequired().typeError('PromotionId must be a number'),
    quantity: (0, yup_1.number)().required('Quantity must be required')
});
const validateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cartSchema.validate(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
});
exports.default = validateCart;