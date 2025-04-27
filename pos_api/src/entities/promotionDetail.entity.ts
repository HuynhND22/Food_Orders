import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'promotion_details' })
export class PromotionDetail extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'promotion_detail_id' })
  promotionDetailId: number;

  @IsNotEmpty()
  @Column({ type: 'int', name: 'promotion_id', nullable: true })
  promotionId: number;

  @Column({ type: 'int', name: 'product_size_id', nullable: true })
  productSizeId: number;

  @Column({ type: 'int', name: 'quantity' })
  @Check('quantity > 0')
  quantity: number;

  @Column({ type: 'varchar', length: 255, name: 'description', nullable: true })
  description: string;

  @ManyToOne(() => ProductSize, (ps) => ps.promotionDetails, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_size_id',
  })
  productSize: ProductSize;

  @ManyToOne(() => Promotion, (pm) => pm.promotionDetails, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'promotion_id',
  })
  promotion: Promotion;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
