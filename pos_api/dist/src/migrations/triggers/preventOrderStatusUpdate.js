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
exports.CreateTriggerPreventStatusUpdates = void 0;
class CreateTriggerPreventStatusUpdates {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
        CREATE TRIGGER PreventStatusUpdate
        ON dbo.Orders
        FOR UPDATE, DELETE
        AS
        BEGIN
            IF EXISTS (SELECT 1 FROM deleted WHERE statusId IN (3, 4))
            BEGIN
                RAISERROR ('can't update or delete Orders with statusId [3,4]', 16, 1);
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
            DROP TRIGGER [PreventStatusUpdate];
        `);
        });
    }
}
exports.CreateTriggerPreventStatusUpdates = CreateTriggerPreventStatusUpdates;
