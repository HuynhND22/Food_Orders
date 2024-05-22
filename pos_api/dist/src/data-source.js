"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const user_entity_1 = require("./entities/user.entity");
const orderDetail_entity_1 = require("./entities/orderDetail.entity");
const order_entity_1 = require("./entities/order.entity");
const product_entity_1 = require("./entities/product.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const cart_entity_1 = require("./entities/cart.entity");
const district_entity_1 = require("./entities/district.entity");
const image_entity_1 = require("./entities/image.entity");
const promotion_entity_1 = require("./entities/promotion.entity");
const promotionDetail_entity_1 = require("./entities/promotionDetail.entity");
const province_entity_1 = require("./entities/province.entity");
const size_entity_1 = require("./entities/size.entity");
const status_entity_1 = require("./entities/status.entity");
const table_entity_1 = require("./entities/table.entity");
const ward_entity_1 = require("./entities/ward.entity");
const productSize_entity_1 = require("./entities/productSize.entity");
const resetPasswor_entity_1 = require("./entities/resetPasswor.entity");
const activateUser_entity_1 = require("./entities/activateUser.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
    entities: [
        cart_entity_1.Cart,
        status_entity_1.Status,
        category_entity_1.Category,
        supplier_entity_1.Supplier,
        product_entity_1.Product,
        image_entity_1.Image,
        size_entity_1.Size,
        productSize_entity_1.ProductSize,
        ward_entity_1.Ward,
        district_entity_1.District,
        province_entity_1.Province,
        table_entity_1.Table,
        user_entity_1.User,
        promotion_entity_1.Promotion,
        promotionDetail_entity_1.PromotionDetail,
        order_entity_1.Order,
        orderDetail_entity_1.OrderDetail,
        resetPasswor_entity_1.ResetPassword,
        activateUser_entity_1.ActivateUser
    ],
    migrations: [
        // join(__dirname, '**', '*.\.{ts,js}')
        // "src/migrations/**/*.ts"
        'dist/**/*.entity.ts'
    ],
    // migrations: [
    //   checkCartsUnique
    // ],
    synchronize: true,
    logging: false,
    extra: {
        trustServerCertificate: true,
    }
});
