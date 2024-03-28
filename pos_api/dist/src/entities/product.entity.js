"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const supplier_entity_1 = require("./supplier.entity");
const order_details_entity_1 = require("./order-details.entity");
let Product = class Product {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'Id' }),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Name', type: 'nvarchar', length: 100 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Price', type: 'decimal', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Discount', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Stock', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Description', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Product.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (c) => c.products),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", category_entity_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, (s) => s.products),
    __metadata("design:type", supplier_entity_1.Supplier)
], Product.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_details_entity_1.OrderDetail, (od) => od.product),
    __metadata("design:type", Array)
], Product.prototype, "orderDetails", void 0);
Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'Products' })
], Product);
exports.Product = Product;
