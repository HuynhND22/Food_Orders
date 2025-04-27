import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { PromotionDetail } from './promotionDetail.entity';
import { Size } from './size.entity';
import { OrderDetail } from './orderDetail.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'product_sizes' })
export class ProductSize extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'product_size_id' })
  productSizeId: number;

  @Column({ name: 'size_id', comment: 'Classifier Size', nullable: true })
  sizeId: number;

  @IsNotEmpty()
  @Column({ name: 'product_id', comment: 'Classifier Product' })
  productId: number;

  @Column({ type: 'int', name: 'price' })
  @Check('price > 0')
  price: number;

  @Column({ type: 'int', name: 'discount', default: 0 })
  @Check('discount >= 0 AND discount <= 50')
  discount: number;

  @Column({ type: 'int', name: 'stock', default: 0 })
  @Check('stock >= 0')
  stock: number;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: string;

  @ManyToOne(() => Product, (p) => p.productSizes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Size, (s) => s.productSizes)
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @OneToMany(() => Cart, (c) => c.productSize, { onDelete: 'CASCADE' })
  cart: Cart[];

  @OneToMany(() => PromotionDetail, (pmd) => pmd.productSize)
  promotionDetails: PromotionDetail[];

  @OneToMany(() => OrderDetail, (od) => od.productSize, { onDelete: 'CASCADE' })
  orderDetails: OrderDetail[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
