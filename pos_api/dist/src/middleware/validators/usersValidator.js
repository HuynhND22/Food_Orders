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
const userSchema = (0, yup_1.object)().shape({
    firstName: (0, yup_1.string)().required('First name must be required'),
    lastName: (0, yup_1.string)().required('Last name must be required'),
    gender: (0, yup_1.string)().required('Gender must be required').oneOf(['Nam', 'Nữ'], 'Gender must be either "Nam" or "Nữ"'),
    email: (0, yup_1.string)().email('Email is invalid').required('Email must be required'),
    phoneNumber: (0, yup_1.string)().notRequired().max(10, 'Phone number must be 10 characters').matches(/^[0-9]+$/, 'Phone number must be a number'),
    address: (0, yup_1.string)().notRequired(),
    wardId: (0, yup_1.string)().notRequired(),
    statusId: (0, yup_1.number)().required('Status must be required').typeError('Status must be a number'),
    role: (0, yup_1.string)().required('Role must be required').oneOf(['Quản trị viên', 'Nhân viên'], 'Role must be either "Quản trị viên" or "Nhân viên'),
});
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userSchema.validate(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.errors);
    }
});
exports.default = validateUser;
