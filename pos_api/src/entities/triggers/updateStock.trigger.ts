import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerExample1643993429000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER [trg_ExampleTrigger]
            ON [dbo].[YourTableName]
            AFTER INSERT, UPDATE
            AS
            BEGIN
                -- Insert code for your trigger action here
                -- For example:
                -- INSERT INTO [dbo].[AuditTable] (Action, Date) VALUES ('Insert', GETDATE())
            END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER [trg_ExampleTrigger];
        `);
    }
}
