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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
let Customer = class Customer {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'Id' }),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'FirstName', type: 'nvarchar', length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'LastName', type: 'nvarchar', length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PhoneNumber', length: 15, type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Address', type: 'nvarchar', length: 500 }),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Birthday', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Email', unique: true, length: 50, type: 'varchar' }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (o) => o.customer),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)({ name: 'Customers' })
], Customer);
exports.Customer = Customer;
