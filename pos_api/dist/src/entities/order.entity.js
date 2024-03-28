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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const order_details_entity_1 = require("./order-details.entity");
const customer_entity_1 = require("./customer.entity");
const employee_entity_1 = require("./employee.entity");
let Order = class Order {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'Id' }),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CreatedDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Order.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ShippedDate', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "shippedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Status', type: 'varchar', default: 'WAITING', length: 50 }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Description', type: 'nvarchar', length: 'MAX', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ShippingAddress', type: 'nvarchar', nullable: true, length: 500 }),
    __metadata("design:type", String)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ShippingCity', type: 'nvarchar', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Order.prototype, "shippingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PaymentType', type: 'varchar', length: 20, default: 'CASH' }),
    __metadata("design:type", String)
], Order.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Order.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (c) => c.orders),
    __metadata("design:type", customer_entity_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, (e) => e.orders),
    __metadata("design:type", employee_entity_1.Employee)
], Order.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_details_entity_1.OrderDetail, (od) => od.order),
    __metadata("design:type", Array)
], Order.prototype, "orderDetails", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)({ name: 'Orders' })
], Order);
exports.Order = Order;
