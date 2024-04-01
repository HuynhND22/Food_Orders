import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, maxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { PromotionDetail } from './promotionDetail.entity';
import { Size } from './size.entity';
import { OrderDetail } from './orderDetail.entity';

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
  price: number;

  @Column({type: 'int'})
  stock: number;
  @MaxLength(11)

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

  @OneToMany(() => PromotionDetail, (pmd) => pmd.productSizes)
  promotionDetail: PromotionDetail;

  @OneToMany(() => OrderDetail, (od) => od.productSizes)
  // @JoinColumn({
  //   name: 'productSizeId',
  //   referencedColumnName: 'productSizeId'
  // })
  orderDetail: OrderDetail;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
