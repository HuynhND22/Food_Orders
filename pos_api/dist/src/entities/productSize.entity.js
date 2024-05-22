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
exports.ProductSize = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const product_entity_1 = require("./product.entity");
const promotionDetail_entity_1 = require("./promotionDetail.entity");
const size_entity_1 = require("./size.entity");
const orderDetail_entity_1 = require("./orderDetail.entity");
const cart_entity_1 = require("./cart.entity");
let ProductSize = class ProductSize extends typeorm_1.BaseEntity {
    // HOOKS (AUTO VALIDATE)
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'productSizeId' }),
    __metadata("design:type", Number)
], ProductSize.prototype, "productSizeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sizeId', comment: 'Classifier Size', nullable: true }),
    __metadata("design:type", Number)
], ProductSize.prototype, "sizeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ name: 'productId', comment: 'Classifier Product' }),
    __metadata("design:type", Number)
], ProductSize.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, typeorm_1.Check)('"price" > 0'),
    __metadata("design:type", Number)
], ProductSize.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, typeorm_1.Check)(`"discount" >= 0 AND "discount" <= 50`),
    __metadata("design:type", Number)
], ProductSize.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, typeorm_1.Check)('"stock" >= 0'),
    __metadata("design:type", Number)
], ProductSize.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", String)
], ProductSize.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (p) => p.productSizes),
    (0, typeorm_1.JoinColumn)({
        name: 'productId'
    }),
    __metadata("design:type", product_entity_1.Product)
], ProductSize.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => size_entity_1.Size, (s) => s.productSizes),
    (0, typeorm_1.JoinColumn)({
        name: 'sizeId'
    }),
    __metadata("design:type", size_entity_1.Size)
], ProductSize.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_entity_1.Cart, (c) => c.productSizes),
    __metadata("design:type", cart_entity_1.Cart)
], ProductSize.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promotionDetail_entity_1.PromotionDetail, (pmd) => pmd.productSize),
    __metadata("design:type", Array)
], ProductSize.prototype, "promotionDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderDetail_entity_1.OrderDetail, (od) => od.productSize),
    __metadata("design:type", Array)
], ProductSize.prototype, "orderDetails", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductSize.prototype, "validate", null);
ProductSize = __decorate([
    (0, typeorm_1.Entity)({ name: 'ProductSizes' })
], ProductSize);
exports.ProductSize = ProductSize;
