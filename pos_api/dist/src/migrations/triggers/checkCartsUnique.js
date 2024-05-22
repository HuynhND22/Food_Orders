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
exports.checkCartsUnique = void 0;
class checkCartsUnique {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
        CREATE OR ALTER TRIGGER CheckCarts
        ON dbo.Carts
        AFTER INSERT, UPDATE
        AS
        BEGIN
            IF EXISTS (SELECT 1 FROM inserted WHERE (promotionId IS NULL AND productSizeId IS NULL))
            BEGIN
                RAISERROR ('promotionId or productSizeId is required', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
            IF EXISTS (SELECT 1 FROM inserted WHERE promotionId IS NOT NULL AND productSizeId IS NOT NULL)
            BEGIN
                RAISERROR ('only promotionId or productSizeId', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
            IF EXISTS (
                SELECT 1
                FROM dbo.Carts AS c
                INNER JOIN inserted AS i ON c.tableId = i.tableId
                WHERE (c.promotionId = i.promotionId OR c.productSizeId = i.productSizeId) AND c.cartId <> i.cartId
            )
            BEGIN
                RAISERROR ('promotionId or productSizeId already exists ', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
        END;
        
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DROP TRIGGER [CheckCarts];
        `);
        });
    }
}
exports.checkCartsUnique = checkCartsUnique;
