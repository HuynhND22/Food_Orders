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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const orderDetail_entity_1 = require("./orderDetail.entity");
const user_entity_1 = require("./user.entity");
const table_entity_1 = require("./table.entity");
const status_entity_1 = require("./status.entity");
let Order = class Order extends typeorm_1.BaseEntity {
    // HOOKS (AUTO VALIDATE)
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ primaryKeyConstraintName: 'orderId' }),
    __metadata("design:type", Number)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Order.prototype, "tableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 10 }),
    __metadata("design:type", Number)
], Order.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255, default: ["N'Tiền mặt'"] }),
    (0, class_validator_1.IsIn)(['Tiền mặt', 'Ngân hàng']),
    __metadata("design:type", String)
], Order.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', name: 'createdAt', default: () => "GETUTCDATE()" }),
    __metadata("design:type", String)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "datetime", default: () => "GETUTCDATE()", nullable: true, onUpdate: "GETUTCDATE()" }),
    __metadata("design:type", String)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderDetail_entity_1.OrderDetail, (od) => od.order),
    __metadata("design:type", Array)
], Order.prototype, "orderDetails", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.orders),
    (0, typeorm_1.JoinColumn)({
        name: 'userId',
        referencedColumnName: 'userId'
    }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => table_entity_1.Table, (p) => p.orders),
    (0, typeorm_1.JoinColumn)({
        name: 'tableId',
        referencedColumnName: 'tableId'
    }),
    __metadata("design:type", table_entity_1.Table)
], Order.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_entity_1.Status, (s) => s.orders),
    (0, typeorm_1.JoinColumn)({
        name: "statusId",
        referencedColumnName: 'statusId'
    }),
    __metadata("design:type", status_entity_1.Status)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Order.prototype, "validate", null);
Order = __decorate([
    (0, typeorm_1.Entity)({ name: 'Orders' })
], Order);
exports.Order = Order;
