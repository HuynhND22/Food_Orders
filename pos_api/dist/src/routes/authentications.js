"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_controller_1 = __importDefault(require("../controllers/authentication.controller"));
const authenticationsValidator_1 = __importDefault(require("../middleware/validators/authenticationsValidator"));
const router = express_1.default.Router();
router.post('/login', authenticationsValidator_1.default, authentication_controller_1.default.login);
exports.default = router;
