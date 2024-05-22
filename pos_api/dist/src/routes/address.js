"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = __importDefault(require("../controllers/address.controller"));
const router = express_1.default.Router();
router.get('/provinces', address_controller_1.default.getProvinces);
router.get('/districts/:provinceId', address_controller_1.default.getDistricts);
router.get('/wards/:districtId', address_controller_1.default.getWards);
exports.default = router;
