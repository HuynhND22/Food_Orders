import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { validateOrReject } from 'class-validator';
import { BankInformation } from './bankInfomation.entity';

@Entity({ name: 'bank_history' }) // Đổi tên bảng theo chuẩn PostgreSQL
export class BankHistory {
  @PrimaryColumn({name:'history_id'})
  historyId: string;
  
  @Column({name:'account_number', nullable:true})
  accountNumber: string;

  @Column({ type: 'int', nullable:true })
  amount: number;
  
  @Column({ type: 'varchar', nullable:true, length: 255 })
  description: string;

  @ManyToOne(() => BankInformation, (bi) => bi.bankHistory)
  @JoinColumn({ name: 'account_number' })
  bank: BankInformation;
  

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
