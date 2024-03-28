import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'PromotionDetails' })
export class PromotionDetail extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  promotionDetailId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({ type: 'int' })
  promotionId: number;

  @Column({type: 'int'})
  productId: number;

  @Column({type: 'int'})
  quantity: number;
  @MaxLength(11)

  @Column({type: 'nvarchar', length: 255})
  description: string;
  

  @ManyToOne(() => ProductSize, (ps) => ps.promotionDetail)
  @JoinColumn({
    name: 'productSizeId',
  })
  productSizes: ProductSize[];

  @ManyToOne(() => Promotion, (pm) => pm.promotionDetail)
  @JoinColumn({
    name: 'promotionId'
  })
  promotions: Promotion[];

 

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
