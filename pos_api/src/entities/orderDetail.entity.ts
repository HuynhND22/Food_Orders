import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'OrderDetails' })
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'orderDetailId' })
  orderDetailId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'int'})
  orderId: number;
  // @MaxLength(11)

  @Column({type: 'int', nullable: true})
  productSizeId?: number;
  // @MaxLength(11)

  @Column({type: 'int', nullable: true})
  promotionId?: number;
  @MaxLength(11)

  @Column({type: 'int'})
  quantity: number;
  @MaxLength(2)

  @Column({type: 'nvarchar', length:255, nullable: true})
  description?: string;

  @Column({type: 'int'})
  price: number;
  @MaxLength(11)

  @Column({type: 'int'})
  discount: number;
  @MaxLength(3)

  @ManyToOne(() => Order, (o) => o.orderDetails)
  @JoinColumn({
    name: 'orderId',
    referencedColumnName: 'orderId'
  })
  order: Order;

  @ManyToOne(() => ProductSize, (p) => p.orderDetail)
  @JoinColumn({
    name: 'productSizeId',
    referencedColumnName: 'productSizeId'
  })
  productSizes: ProductSize[];

  @OneToOne(() => Promotion, (pr) => pr.orderDetail)
  promotion: Promotion;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
