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
const data_source_1 = require("../data-source");
const user_entity_1 = require("../entities/user.entity");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const repository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield repository.findOne({ where: { email: email } });
        const payload = {
            email: user === null || user === void 0 ? void 0 : user.email,
            role: user === null || user === void 0 ? void 0 : user.role,
            iat: Date.now(),
        };
        yield bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.password, function (err, result) {
            if (result == true) {
                jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
                    console.log(err);
                    return res.status(200).json({
                        token: token,
                        user: {
                            email: user === null || user === void 0 ? void 0 : user.email,
                            role: user === null || user === void 0 ? void 0 : user.role,
                            name: `${user === null || user === void 0 ? void 0 : user.firstName} ${user === null || user === void 0 ? void 0 : user.lastName}`
                        }
                    });
                });
            }
            else {
                return res.status(401).json({ message: 'Email or password is incorrect' });
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.default = { login };
