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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const status_entity_1 = require("./status.entity");
const ward_entity_1 = require("./ward.entity");
const order_entity_1 = require("./order.entity");
const resetPasswor_entity_1 = require("./resetPasswor.entity");
const activateUser_entity_1 = require("./activateUser.entity");
let User = class User extends typeorm_1.BaseEntity {
    // HOOKS (AUTO VALIDATE)
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ primaryKeyConstraintName: 'userId' }),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({ query: () => `SELECT CONCAT(firstName, ' ', lastName) AS fullName FROM users;` }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 11, default: 'Nam' }),
    (0, class_validator_1.IsIn)(['Nam', 'Nữ']),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, type: 'nvarchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, type: 'nvarchar', length: 15, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "wardId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], User.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 20, default: ["N'Nhân viên'"] }),
    (0, class_validator_1.IsIn)(['Quản trị viên', 'Nhân viên']),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime', default: () => "GETUTCDATE()" }),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "datetime", default: () => "GETUTCDATE()", nullable: true, onUpdate: "GETUTCDATE()" }),
    __metadata("design:type", String)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_entity_1.Status, (s) => s.users),
    (0, typeorm_1.JoinColumn)({
        name: "statusId",
        referencedColumnName: 'statusId'
    }),
    __metadata("design:type", status_entity_1.Status)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ward_entity_1.Ward, (w) => w.users),
    (0, typeorm_1.JoinColumn)({
        name: 'wardId',
    }),
    __metadata("design:type", ward_entity_1.Ward)
], User.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (o) => o.user),
    (0, typeorm_1.JoinColumn)({
        name: 'userId'
    }),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => resetPasswor_entity_1.ResetPassword, (rp) => rp.user),
    __metadata("design:type", resetPasswor_entity_1.ResetPassword)
], User.prototype, "resetPassword", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => activateUser_entity_1.ActivateUser, (rp) => rp.user),
    __metadata("design:type", activateUser_entity_1.ActivateUser)
], User.prototype, "activateUser", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "validate", null);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'Users' })
], User);
exports.User = User;
