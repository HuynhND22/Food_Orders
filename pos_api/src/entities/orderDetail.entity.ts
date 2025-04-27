import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Order } from './order.entity';
import { ProductSize } from './productSize.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'order_details' }) // PostgreSQL convention
@Check('quantity > 0')
@Check('price > 0')
@Check('discount >= 0 AND discount <= 50')
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'order_detail_id' })
  orderDetailId: number;

  @Column({ type: 'int', default: 1, name: 'quantity' })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'description' })
  description?: string;

  @Column({ type: 'int', name: 'price' })
  price: number;

  @Column({ type: 'int', default: 0, name: 'discount' })
  discount: number;

  
  @Column({ name: 'order_id', nullable: true, type: 'int' })
  orderId: number;

  @ManyToOne(() => Order, (o) => o.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_size_id', nullable: true, type: 'int' })
  productSizeId: number;
  
  @ManyToOne(() => ProductSize, (p) => p.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_size_id' })
  productSize: ProductSize;
  
  @Column({ name: 'promotion_id', nullable: true, type: 'int' })
  promotionId: number;

  @ManyToOne(() => Promotion, (pr) => pr.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
