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
exports.Table = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const status_entity_1 = require("./status.entity");
const cart_entity_1 = require("./cart.entity");
const order_entity_1 = require("./order.entity");
let Table = class Table extends typeorm_1.BaseEntity {
    // HOOKS (AUTO VALIDATE)
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ primaryKeyConstraintName: 'tableId' }),
    __metadata("design:type", Number)
], Table.prototype, "tableId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'int', default: 2 }),
    __metadata("design:type", Number)
], Table.prototype, "seat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Table.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Table.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Table.prototype, "uriCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Table.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', default: () => "GETUTCDATE()" }),
    __metadata("design:type", String)
], Table.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "datetime", default: () => "GETUTCDATE()", nullable: true, onUpdate: "GETUTCDATE()" }),
    __metadata("design:type", String)
], Table.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", String)
], Table.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_entity_1.Status, (s) => s.tables),
    (0, typeorm_1.JoinColumn)({
        name: "statusId",
        referencedColumnName: 'statusId'
    }),
    __metadata("design:type", status_entity_1.Status)
], Table.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (o) => o.table),
    (0, typeorm_1.JoinColumn)({
        name: 'tableId'
    }),
    __metadata("design:type", Array)
], Table.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_entity_1.Cart, (s) => s.table),
    __metadata("design:type", Array)
], Table.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Table.prototype, "validate", null);
Table = __decorate([
    (0, typeorm_1.Entity)({ name: 'Tables' })
], Table);
exports.Table = Table;
