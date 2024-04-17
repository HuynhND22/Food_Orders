import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { User } from './user.entity';
import { Table } from './table.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'States' })
export class Status extends BaseEntity {
  // @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'statusId' })
  // statusId: number;
  // @IsNotEmpty()

  @PrimaryColumn({ type: 'int' })
  statusId: number;

  @Column({type: 'nvarchar', length:255, unique: true})
  name: string;

  @OneToMany(() => User, (u) => u.status)
  users: User[];

  @OneToMany(()=> Table, (t) => t.status)
  tables: Table[];
  
  @OneToMany(() => Product, (p) => p.status)
  products: Product[];

  @OneToMany(() => Order, (o) => o.status)
  orders: Order[];

  @OneToMany(() => Promotion, (p) => p.status)
  promotions: Promotion[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
