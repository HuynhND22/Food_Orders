import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, maxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { Table } from './table.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'Carts' })
export class Cart extends BaseEntity {
  @PrimaryColumn({ name: 'tableId'})
  tableId: number;
  @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'int'})
  productId: number;
  // @MaxLength(11)

  @Column({type: 'int'})
  promotionId: number;
  // @MaxLength(11)

  @Column({type: 'int'})
  quantity: number;
  @MaxLength(2)

  @OneToOne(() => Table, (t) => t.cart)
  @JoinColumn({name: 'tableId', referencedColumnName: 'tableId'})
  table: Table;

  @OneToOne(() => Product, (p) => p.cart)
  @JoinColumn({name: 'productId'})
  product: Product;

  @OneToOne(() => Promotion, (pr) => pr.cart)
  @JoinColumn({name: 'promotionId'})
  promotion: Promotion;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
