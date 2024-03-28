"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const customer_entity_1 = require("./entities/customer.entity");
const employee_entity_1 = require("./entities/employee.entity");
const order_details_entity_1 = require("./entities/order-details.entity");
const order_entity_1 = require("./entities/order.entity");
const product_entity_1 = require("./entities/product.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const category_view_entity_1 = require("./entities/views/category-view.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: undefined,
    database: 'order_food',
    // entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
    entities: [category_entity_1.Category, supplier_entity_1.Supplier, product_entity_1.Product, customer_entity_1.Customer, employee_entity_1.Employee, order_entity_1.Order, order_details_entity_1.OrderDetail, category_view_entity_1.CategoryView],
    synchronize: false,
    logging: false
});
