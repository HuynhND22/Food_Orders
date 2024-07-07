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
  @IsNotEmpty()

  @Column({type: 'nvarchar', length:255, unique: true})
  name: string;

  @Column({type: 'int'})
  @Check('"limit" > 0')
  limit: number;

  @Column({type: 'int'})
  @Check('"price" > 0')
  price: number;

  @Column({type: 'date', default: () => "GETUTCDATE()"})
  startDate: string;

  @Column({type: 'date', default: () => "GETUTCDATE()"})
  @Check(`"endDate" >= "startDate"`)
  endDate: string;

  @Column({type: 'int'})
  statusId: number;

  @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  createdAt: String;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @OneToMany(() => OrderDetail, (od) => od.promotion)
  orderDetails: OrderDetail[];

  @ManyToOne(() => Status, (s) => s.promotions, {onDelete: 'CASCADE'} )
  @JoinColumn({
    name: "statusId",
    referencedColumnName: 'statusId'
  })
  status: Status;

  @OneToMany(() => PromotionDetail, (pd) => pd.promotion)
  promotionDetails: PromotionDetail[];

  @OneToMany(() => Cart, (c) => c.promotion)
    carts: Cart[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
