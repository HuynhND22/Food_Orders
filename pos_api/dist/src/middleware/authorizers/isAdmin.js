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
const jwt = require("jsonwebtoken");
require('dotenv').config();
const checkJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization');
        const auth = yield jwt.decode(token === null || token === void 0 ? void 0 : token.replace('Bearer ', ''), process.env.JWT_SECRET);
        if (auth.role !== 'Quản trị viên') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        ;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Forbidden' });
    }
});
exports.default = checkJWT;
