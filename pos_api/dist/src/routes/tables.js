"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const table_controller_1 = __importDefault(require("../controllers/table.controller"));
const tablesValidator_1 = __importDefault(require("../middleware/validators/tablesValidator"));
const router = express_1.default.Router();
router.get('/all', table_controller_1.default.getAll);
router.get('/id/:id', table_controller_1.default.getById);
router.post('/create/', tablesValidator_1.default, table_controller_1.default.create);
router.patch('/update/:id', tablesValidator_1.default, table_controller_1.default.update);
router.delete('/remove/:id', table_controller_1.default.softDelete);
router.get('/deleted/', table_controller_1.default.getDeleted);
router.post('/restore/:id', table_controller_1.default.restore);
router.get('/check/unique', table_controller_1.default.checkTableUnique);
exports.default = router;
