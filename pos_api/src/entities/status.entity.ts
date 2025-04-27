import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { User } from './user.entity';
import { Table } from './table.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'states' }) // Tên bảng chuyển sang snake_case
export class Status extends BaseEntity {
  @PrimaryColumn({ type: 'int', name: 'status_id' }) // Tên cột chuyển sang snake_case
  statusId: number;

  @Column({ type: 'varchar', length: 255 }) // Chuyển từ nvarchar sang varchar
  name: string;

  @OneToMany(() => User, (u) => u.status)
  users: User[];

  @OneToMany(() => Table, (t) => t.status)
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
