"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const usersValidator_1 = __importDefault(require("../middleware/validators/usersValidator"));
const router = express_1.default.Router();
router.get('/all', user_controller_1.default.getAll);
router.get('/id/:id', user_controller_1.default.getById);
router.post('/create/', usersValidator_1.default, user_controller_1.default.create);
router.patch('/update/:id', user_controller_1.default.update);
router.delete('/remove/:id', user_controller_1.default.softDelete);
router.get('/deleted/', user_controller_1.default.getDeleted);
router.post('/restore/:id', user_controller_1.default.restore);
router.delete('/delete/:id', user_controller_1.default.hardDelete);
router.get('/check/unique', user_controller_1.default.checkUserUnique);
exports.default = router;
