"use strict";
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
exports.CreateTriggerUpdateStockProduct = void 0;
class CreateTriggerUpdateStockProduct {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
        CREATE TRIGGER UpdateStockOnOrderStatus
        ON Orders
        AFTER INSERT
        AS
        BEGIN
            DECLARE @orderId INT, @statusId INT;
        
            SELECT @orderId = orderId, @statusId = statusId
            FROM inserted;
        
            IF @statusId = 3
            BEGIN
                UPDATE ProductSizes
                SET stock = stock - 1
                FROM ProductSizes ps
                JOIN OrderDetails od ON ps.productSizeId = od.productSizeId
                WHERE od.orderId = @orderId;
            END;
        END;
        
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DROP TRIGGER [UpdateStockOnOrderStatus];
        `);
        });
    }
}
exports.CreateTriggerUpdateStockProduct = CreateTriggerUpdateStockProduct;
