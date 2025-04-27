import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Cart } from './cart.entity';
import { Status } from './status.entity';
import { OrderDetail } from './orderDetail.entity';
import { PromotionDetail } from './promotionDetail.entity';

@Entity({ name: 'promotions' })
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'promotion_id' })
  promotionId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, unique: true, name: 'name' })
  name: string;

  @Column({ type: 'int', name: 'quota' })
  @Check('quota > 0')
  quota: number;

  @Column({ type: 'int', name: 'price' })
  @Check('price > 0')
  price: number;

  @Column({ name: 'start_date', type: 'date', default: () => 'CURRENT_DATE' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', default: () => 'CURRENT_DATE' })
  endDate: string;
  @Check('"end_date" >= "start_date"')

  @Column({ type: 'int', name: 'status_id' })
  statusId: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt?: string;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: string;

  @OneToMany(() => OrderDetail, (od) => od.promotion)
  orderDetails: OrderDetail[];

  @ManyToOne(() => Status, (s) => s.promotions, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'status_id',
    referencedColumnName: 'statusId',
  })
  status: Status;

  @OneToMany(() => PromotionDetail, (pd) => pd.promotion)
  promotionDetails: PromotionDetail[];

  @OneToMany(() => Cart, (c) => c.promotion)
  carts: Cart[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
