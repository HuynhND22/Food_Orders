import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { validateOrReject } from 'class-validator';
import { BankHistory } from './bankHistory.entity';

@Entity({ name: 'bank_information' }) // Đổi tên bảng theo chuẩn PostgreSQL
export class BankInformation {
  @PrimaryColumn({name:'account_number'})
  accountNumber: string;
  
  @Column({ type: 'varchar', nullable:true, length: 255 })
  author: string;
  
  @Column({name:'activate', nullable:true})
  activate: string;
  
  @OneToMany(() => BankHistory, (bh) => bh.bank, {
    cascade: true,       // Cho phép tự động thao tác khi insert/update BankInformation
    onDelete: 'CASCADE', // Khi xóa BankInformation thì xóa luôn bankHistory liên quan
  })
  bankHistory: BankHistory[];  

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
