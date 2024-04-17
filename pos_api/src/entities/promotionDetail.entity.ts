import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'PromotionDetails' })
export class PromotionDetail extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  promotionDetailId: number;
  @IsNotEmpty()

  @Column({ type: 'int' })
  promotionId: number;

  @Column({type: 'int'})
  productSizeId: number;

  @Column({type: 'int'})
  @Check('"quantity" > 0')
  quantity: number;

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
