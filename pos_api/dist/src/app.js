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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("./data-source");
const index_1 = __importDefault(require("./routes/index"));
const categories_1 = __importDefault(require("./routes/categories"));
const tables_1 = __importDefault(require("./routes/tables"));
const users_1 = __importDefault(require("./routes/users"));
const carts_1 = __importDefault(require("./routes/carts"));
const address_1 = __importDefault(require("./routes/address"));
const promotions_1 = __importDefault(require("./routes/promotions"));
const payments_1 = __importDefault(require("./routes/payments"));
const suppliers_1 = __importDefault(require("./routes/suppliers"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const authentications_1 = __importDefault(require("./routes/authentications"));
const app = (0, express_1.default)();
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Data source was initialized');
    app.use((0, morgan_1.default)('dev'));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    app.use(express_1.default.static(path_1.default.resolve('./public')));
    // use cors
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use('/api/', index_1.default);
    app.use('/categories', categories_1.default);
    app.use('/tables', tables_1.default);
    app.use('/users', users_1.default);
    app.use('/carts', carts_1.default);
    app.use('/address', address_1.default);
    app.use('/promotions', promotions_1.default);
    app.use('/payments', payments_1.default);
    app.use('/suppliers', suppliers_1.default);
    app.use('/products', products_1.default);
    app.use('/orders', orders_1.default);
    app.use('/auth', authentications_1.default);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        res.status(404).send('Not found');
        // next(createError(404));
    });
    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}));
exports.default = app;
