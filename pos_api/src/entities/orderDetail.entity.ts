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
  @IsNotEmpty()

  @Column({type: 'int'})
  orderId: number;

  @Column({type: 'int', nullable: true})
  productSizeId?: number;

  @Column({type: 'int', nullable: true})
  promotionId?: number;
  @MaxLength(11)

  @Column({type: 'int', default: 1})
  @Check('"quantity" > 0')
  quantity: number;

  @Column({type: 'nvarchar', length:255, nullable: true})
  description?: string;

  @Column({type: 'int'})
  @Check('"price" > 0')
  price: number;

  @Column({type: 'int', default: 0})
  @Check(`"discount" >= 0 AND "discount" <= 50`)
  discount: number;

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

  @ManyToOne(() => Promotion, (pr) => pr.orderDetails)
  promotion: Promotion;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
