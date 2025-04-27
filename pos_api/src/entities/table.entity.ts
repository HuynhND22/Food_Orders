import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Status } from './status.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity({ name: 'tables' })
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'table_id' })
  tableId: number;

  @IsNotEmpty()
  @Column({ type: 'int', default: 2, name: 'seat' })
  seat: number;

  @Column({ type: 'varchar', length: 255, unique: true, name: 'name' })
  name: string;

  @Column({ type: 'int', nullable: true, name: 'status_id' })
  statusId?: number;

  @Column({ type: 'varchar', nullable: true, name: 'uri_code' })
  uriCode: string;

  @Column({ type: 'varchar', length: 255, name: 'qr_code' })
  qrCode: string;

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", name: 'created_at' })
  createdAt: String;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: true, onUpdate: "CURRENT_TIMESTAMP", name: 'updated_at' })
  updatedAt?: String;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: String;

  @ManyToOne(() => Status, (s) => s.tables)
  @JoinColumn({
    name: "status_id",
    referencedColumnName: 'statusId'
  })
  status: Status;

  @OneToMany(() => Order, (o) => o.table, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'table_id'
  })
  orders: Order[];

  @OneToMany(() => Cart, (s) => s.table, { onDelete: 'CASCADE' })
  carts: Cart[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
