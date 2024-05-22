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
exports.Ward = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const district_entity_1 = require("./district.entity");
const user_entity_1 = require("./user.entity");
const supplier_entity_1 = require("./supplier.entity");
let Ward = class Ward extends typeorm_1.BaseEntity {
    // HOOKS (AUTO VALIDATE)
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, class_validator_1.validateOrReject)(this);
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ primaryKeyConstraintName: 'wardId' }),
    __metadata("design:type", Number)
], Ward.prototype, "wardId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'nvarchar', length: 255 }),
    __metadata("design:type", String)
], Ward.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Ward.prototype, "districtId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => district_entity_1.District, (d) => d.wards),
    (0, typeorm_1.JoinColumn)({
        name: 'districtId'
    }),
    __metadata("design:type", district_entity_1.District)
], Ward.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (u) => u.ward),
    __metadata("design:type", Array)
], Ward.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => supplier_entity_1.Supplier, (s) => s.ward),
    __metadata("design:type", Array)
], Ward.prototype, "suppliers", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Ward.prototype, "validate", null);
Ward = __decorate([
    (0, typeorm_1.Entity)({ name: 'Wards' })
], Ward);
exports.Ward = Ward;
