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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const class_validator_1 = require("class-validator");
let Employee = class Employee {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'employeeId' }),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(11),
    (0, class_validator_1.IsNotEmpty)()
    // FIRST NAME
    ,
    (0, typeorm_1.Column)({ name: 'FirstName', type: 'nvarchar', length: 50 }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'LastName', type: 'nvarchar', length: 50 }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PhoneNumber', length: 15, type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Address', type: 'nvarchar', length: 500 }),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Birthday', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Employee.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Email', unique: true, length: 50, type: 'varchar' }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (o) => o.customer),
    __metadata("design:type", Array)
], Employee.prototype, "orders", void 0);
Employee = __decorate([
    (0, typeorm_1.Entity)({ name: 'Employees' })
], Employee);
exports.Employee = Employee;
