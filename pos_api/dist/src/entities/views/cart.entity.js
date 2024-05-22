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
exports.Cart = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
// import { Product } from './product.entity';
// import { Table } from './table.entity';
// import { Promotion } from './promotion.entity';
let Cart = class Cart extends typeorm_1.BaseEntity {
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'tableId' }),
    __metadata("design:type", Number)
], Cart.prototype, "tableId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Cart.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Cart.prototype, "promotionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Cart.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(2)
    //   @OneToOne(() => Table, (t) => t.cart)
    //   @JoinColumn({ name: 'tableId' })
    //   table: Product[];
    //   @OneToMany(() => Product, (p) => p.cart)
    //   @JoinColumn({ name: 'productId' })
    //   products: Product[];
    //   @OneToMany(() => Promotion, (pr) => pr.cart)
    //   @JoinColumn({ 
    //     name: 'promotionId',
    //     // referencedColumnName: 'promotionId'
    //   })
    //   promotions: Product[];
    // HOOKS (AUTO VALIDATE)
    ,
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Cart.prototype, "validate", null);
Cart = __decorate([
    (0, typeorm_1.Entity)({ name: 'Carts' })
], Cart);
exports.Cart = Cart;
