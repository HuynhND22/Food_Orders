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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const checkUnique_1 = __importDefault(require("../helpers/checkUnique"));
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const repository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield repository.find();
        if (users.length === 0) {
            return res.status(204).json({
                error: 'No content',
            });
        }
        return res.json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield repository.findOneBy({ userId: parseInt(req.params.id) });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        return res.json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bcrypt = require('bcrypt');
        const saltRounds = 7;
        let data = req.body;
        const password = req.body.password;
        if (data['password']) {
            const hashedPassword = yield bcrypt.hash(password, saltRounds);
            data['password'] = hashedPassword;
            console.log('password: ' + password);
            console.log(hashedPassword);
        }
        const user = new user_entity_1.User();
        Object.assign(user, data);
        yield repository.save(user);
        return res.json(user);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: error });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bcrypt = require('bcrypt');
    const saltRounds = 7;
    try {
        const user = yield repository.findOneBy({ userId: parseInt(req.params.id) });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        let data = req.body;
        const hashedPassword = yield bcrypt.hash(req.body.password, saltRounds);
        data['password'] = hashedPassword;
        Object.assign(user, data);
        yield repository.save(user);
        return res.json(user);
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield repository.findOneBy({ userId: parseInt(req.params.id) });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.softDelete({ userId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield repository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (users.length === 0) {
            return res.status(204).json({ error: 'No content' });
        }
        return res.json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const restore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield repository.findOne({ withDeleted: true, where: { userId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.restore({ userId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const hardDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield repository.findOne({ withDeleted: true, where: { userId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!user) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield repository.delete({ userId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const checkUserUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, ignore, field } = req.query;
    if (ignore && ignore == value) {
        return res.sendStatus(200);
    }
    try {
        const check = yield (0, checkUnique_1.default)(user_entity_1.User, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { getAll, getById, create, update, softDelete, getDeleted, restore, hardDelete, checkUserUnique };
