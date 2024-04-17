import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';
import { PromotionDetail } from './promotionDetail.entity';

@Entity({ name: 'Sizes' })
export class Size extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'sizeId' })
  sizeId: number;
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255, unique: true})
  name: string;

  @OneToMany(() => ProductSize, (ps) => ps.size)
  productSizes: ProductSize[];
  
  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
