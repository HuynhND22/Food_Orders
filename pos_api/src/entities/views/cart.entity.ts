import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, maxLength, validateOrReject } from 'class-validator';
// import { Product } from './product.entity';
// import { Table } from './table.entity';
// import { Promotion } from './promotion.entity';

@Entity({ name: 'Carts' })
export class Cart extends BaseEntity {
  @PrimaryColumn({ name: 'tableId'})
  tableId: number;
  // @MaxLength(11)
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

//   @OneToOne(() => Table, (t) => t.cart)
//   @JoinColumn({ name: 'tableId' })
//   table: Product[];

//   @OneToMany(() => Product, (p) => p.cart)
//   @JoinColumn({ name: 'productId' })
//   products: Product[];

//   @OneToMany(() => Promotion, (pr) => pr.cart)
//   @JoinColumn({ 
//     name: 'promotionId',
//     // referencedColumnName: 'promotionId'
//   })
//   promotions: Product[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
