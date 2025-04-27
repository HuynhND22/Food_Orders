import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { validateOrReject, IsNotEmpty, IsIn } from 'class-validator';
import { Table } from './table.entity';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';
import { Product } from './product.entity';
import { Ward } from './ward.entity';
import { Province } from './province.entity';
import { OrderDetail } from './orderDetail.entity';
import { User } from './user.entity';
import { Status } from './status.entity';

@Entity({ name: 'orders' }) // PostgreSQL convention
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'payment', type: 'varchar', length: 255, default: 'Tiền mặt' })
  @IsIn(['Tiền mặt', 'Ngân hàng'])
  payment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => OrderDetail, (od) => od.order)
  orderDetails: OrderDetail[];

  @ManyToOne(() => User, (u) => u.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'table_id', nullable: true, type: 'int' })
  tableId: number;
  
  @ManyToOne(() => Table, (t) => t.orders)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @Column({ name: 'status_id', nullable: true, type: 'int', default: 10 })
  statusId: number;
  
  @ManyToOne(() => Status, (s) => s.orders)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @OneToMany(() => OrderDetail, (od) => od.order)
  orderDetail: OrderDetail;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}