import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn, DeleteDateColumn } from 'typeorm';
import { validateOrReject } from 'class-validator';

@Entity({ name: 'BankInfomation' })
export class BankInfomation extends BaseEntity {
  @PrimaryColumn({ primaryKeyConstraintName: 'AccountNumber' })
  accountNumber: string;

  @Column({type: 'nvarchar', length: 255 })
  author: string;

  @Column({type: 'nvarchar', length: 255 })
  bankName: string;

   @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
