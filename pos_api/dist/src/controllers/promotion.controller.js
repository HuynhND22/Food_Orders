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
const promotion_entity_1 = require("../entities/promotion.entity");
const promotionDetail_entity_1 = require("../entities/promotionDetail.entity");
const typeorm_1 = require("typeorm");
const checkUnique_1 = __importDefault(require("../helpers/checkUnique"));
const handleUniqueError_1 = require("../helpers/handleUniqueError");
const promotionRepository = data_source_1.AppDataSource.getRepository(promotion_entity_1.Promotion);
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield promotionRepository.find();
        if (promotions.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(promotions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotionRepository.findOne({
            where: { promotionId: parseInt(req.params.id) },
            relations: ['promotionDetails']
        });
        promotion ? res.status(200).json(promotion) : res.sendStatus(410);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryRunner = promotionRepository.manager.connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            const promotion = req.body;
            const result = yield queryRunner.manager.save(promotion_entity_1.Promotion, promotion);
            const promotionDetails = promotion.promotionDetails.map((pd) => {
                return Object.assign(Object.assign({}, pd), { promotionId: result.promotionId });
            });
            yield queryRunner.manager.save(promotionDetail_entity_1.PromotionDetail, promotionDetails);
            yield queryRunner.commitTransaction();
            res.sendStatus(200);
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            res.status(500).json({ error: 'Transaction failed' });
        }
        finally {
            yield queryRunner.release();
        }
    }
    catch (error) {
        if (error.number == 2627) {
            const message = (0, handleUniqueError_1.handleUniqueError)(error);
            return res.status(400).json({ error: message });
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryRunner = promotionRepository.manager.connection.createQueryRunner();
        yield queryRunner.connect();
        yield queryRunner.startTransaction();
        try {
            const promotion = req.body;
            const found = yield queryRunner.manager.findOne(promotion_entity_1.Promotion, { where: { promotionId: parseInt(req.params.id) } });
            if (!found)
                return res.sendStatus(410);
            Object.entries(promotion).forEach(([key, value]) => {
                found[key] = value;
            });
            yield queryRunner.manager.save(found, promotion);
            if (promotion.promotionDetails) {
                yield queryRunner.manager.delete(promotionDetail_entity_1.PromotionDetail, { promotionId: parseInt(req.params.id) });
                const promotionDetails = promotion.promotionDetails.map((pd) => {
                    return Object.assign(Object.assign({}, pd), { promotionId: parseInt(req.params.id) });
                });
                yield queryRunner.manager.save(promotionDetail_entity_1.PromotionDetail, promotionDetails);
            }
            yield queryRunner.commitTransaction();
            const result = yield promotionRepository.findOne({ where: { promotionId: parseInt(req.params.id) }, relations: ['promotionDetails'] });
            res.status(200).send(result);
        }
        catch (error) {
            yield queryRunner.rollbackTransaction();
            if (error.number == 2627) {
                const message = (0, handleUniqueError_1.handleUniqueError)(error);
                return res.status(400).json({ error: message });
            }
            console.log(error);
            return res.status(500).send(error);
        }
        finally {
            yield queryRunner.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotionRepository.findOneBy({ promotionId: parseInt(req.params.id) });
        if (!promotion) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield promotionRepository.softDelete({ promotionId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const restore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotionRepository.findOne({ withDeleted: true, where: { promotionId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!promotion) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield promotionRepository.restore({ promotionId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getDeleted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield promotionRepository.find({ withDeleted: true, where: { deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) }, relations: ['promotionDetails'] });
        if (promotions.length === 0) {
            return res.status(204).send({
                error: 'No content'
            });
        }
        res.json(promotions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const hardDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotion = yield promotionRepository.findOne({ withDeleted: true, where: { promotionId: parseInt(req.params.id), deletedAt: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } });
        if (!promotion) {
            return res.status(410).json({ error: 'Not found' });
        }
        yield promotionRepository.delete({ promotionId: parseInt(req.params.id) });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const checkPromotionUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, ignore, field } = req.query;
    if (ignore && ignore === value) {
        return res.sendStatus(200);
    }
    try {
        const check = yield (0, checkUnique_1.default)(promotion_entity_1.Promotion, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = { getAll,
    getById,
    create,
    update,
    softDelete,
    restore,
    getDeleted,
    hardDelete,
    checkPromotionUnique
};
