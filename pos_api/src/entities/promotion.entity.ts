import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Cart } from './cart.entity';
import { Status } from './status.entity';
import { Product } from './product.entity';
import { OrderDetail } from './orderDetail.entity';
import { PromotionDetail } from './promotionDetail.entity';

@Entity({ name: 'Promotions' })
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'promotionId' })
  promotionId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length:255})
  name: string;

  @Column({type: 'int'})
  limit: number;
  @MaxLength(5)

  @Column({type: 'int'})
  price: number;
  @MaxLength(11)

  @Column({type: 'date'})
  startDate: string;

  @Column({type: 'date'})
  endDate: string;

  // @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  // createdAt: String;

  // @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  // updatedAt?: String;

  // @DeleteDateColumn({nullable: true})
  // deletedAt?: String;
  
  // @OneToOne(() => Cart, (c) => c.promotion)
  // @JoinColumn({
  //   name: 'promotionId',
  //   referencedColumnName: 'promotionId'
  // })
  // cart: Cart;

  @OneToOne(() => OrderDetail, (od) => od.promotion)
  @JoinColumn({
    name: "promotionId",
    // referencedColumnName: 'orderDetailId',
  })
  orderDetail: OrderDetail;

  @OneToOne(() => Status, (s) => s.promotion)
  @JoinColumn({
    name: "statusId",
    referencedColumnName: 'statusId'
  })
  status: Status;

  @OneToMany(() => PromotionDetail, (pd) => pd.promotions)
  promotionDetail: PromotionDetail;

  @OneToOne(() => Cart, (c) => c.promotion)
    cart: Cart;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
