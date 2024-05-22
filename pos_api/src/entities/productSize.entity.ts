import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, maxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { PromotionDetail } from './promotionDetail.entity';
import { Size } from './size.entity';
import { OrderDetail } from './orderDetail.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'ProductSizes' })
export class ProductSize extends BaseEntity {

  @PrimaryGeneratedColumn({ name: 'productSizeId' })
  productSizeId: number;

  @Column({ name: 'sizeId', comment: 'Classifier Size', nullable: true })
  sizeId: number;
  @IsNotEmpty()

  @Column({name: 'productId', comment: 'Classifier Product'})
  productId: number;

  @Column({type: 'int'})
  @Check('"price" > 0')
  price: number;

  @Column({type: 'int', default: 0})
  @Check(`"discount" >= 0 AND "discount" <= 50`)
  discount: number;

  @Column({type: 'int'})
  @Check('"stock" >= 0')
  stock: number;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @ManyToOne(() => Product, (p) => p.productSizes)
  @JoinColumn({
    name: 'productId'
  })
  product: Product;

  @ManyToOne(() => Size, (s) => s.productSizes)
  @JoinColumn({
    name: 'sizeId'
  })
  size: Size;

  @OneToMany(() => Cart, (c) => c.productSizes)
  cart: Cart;

  @OneToMany(() => PromotionDetail, (pmd) => pmd.productSize)
  promotionDetails: PromotionDetail[];

  @OneToMany(() => OrderDetail, (od) => od.productSize)
  orderDetails: OrderDetail[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
