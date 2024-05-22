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
exports.OrderDetail = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const order_entity_1 = require("./order.entity");
const promotion_entity_1 = require("./promotion.entity");
const productSize_entity_1 = require("./productSize.entity");
let OrderDetail = class OrderDetail extends typeorm_1.BaseEntity {
    // HOOKS (AUTO VALIDATE)
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ primaryKeyConstraintName: 'orderDetailId' }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "orderDetailId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "productSizeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "promotionId", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(11),
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    (0, typeorm_1.Check)('"quantity" > 0'),
    __metadata("design:type", Number)
], OrderDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], OrderDetail.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, typeorm_1.Check)('"price" > 0'),
    __metadata("design:type", Number)
], OrderDetail.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, typeorm_1.Check)(`"discount" >= 0 AND "discount" <= 50`),
    __metadata("design:type", Number)
], OrderDetail.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (o) => o.orderDetails),
    (0, typeorm_1.JoinColumn)({
        name: 'orderId',
        referencedColumnName: 'orderId'
    }),
    __metadata("design:type", order_entity_1.Order)
], OrderDetail.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => productSize_entity_1.ProductSize, (p) => p.orderDetails),
    (0, typeorm_1.JoinColumn)({
        name: 'productSizeId',
        referencedColumnName: 'productSizeId'
    }),
    __metadata("design:type", productSize_entity_1.ProductSize)
], OrderDetail.prototype, "productSize", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => promotion_entity_1.Promotion, (pr) => pr.orderDetails),
    (0, typeorm_1.JoinColumn)({
        name: "promotionId"
    }),
    __metadata("design:type", promotion_entity_1.Promotion)
], OrderDetail.prototype, "promotion", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderDetail.prototype, "validate", null);
OrderDetail = __decorate([
    (0, typeorm_1.Entity)({ name: 'OrderDetails' })
], OrderDetail);
exports.OrderDetail = OrderDetail;
