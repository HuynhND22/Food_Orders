import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { User } from './user.entity';
import { Table } from './table.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'States' })
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'statusId' })
  statusId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length:255})
  name: string;

  @OneToOne(() => User, (u) => u.status)
  user: User;

  @OneToOne(()=> Table, (t) => t.status)
  table: Table;
  
  @OneToOne(() => Product, (p) => p.status)
  product: Product;

  @OneToOne(() => Order, (o) => o.status)
  order: Order;

  @OneToOne(() => Promotion, (p) => p.status)
  promotion: Promotion;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
