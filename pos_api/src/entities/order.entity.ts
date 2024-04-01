import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsIn, IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { OrderDetail } from './orderDetail.entity';
import { User } from './user.entity';
import { Table } from './table.entity';
import { Status } from './status.entity';

@Entity({ name: 'Orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'orderId' })
  orderId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'int'})
  tableId: number;
  // @MaxLength(11)

//   @Column({type: 'int'})
//   statusId: number;
  // @MaxLength(11)

  @Column({type: 'int'})
  userId: number;
  // @MaxLength(11)

  @Column({type: 'nvarchar', length: 255, default: 'Tiền mặt'})
  @IsIn(['Tiền mặt', 'Ngân hàng'])
  payment: string;

  @CreateDateColumn({type: 'datetime', name: 'createdAt', default: () => "GETUTCDATE()"})
  createdAt: String;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @OneToMany(() => OrderDetail, (od) => od.order)
  orderDetails: OrderDetail[];

//   @ManyToMany(
//     () => Product, 
//     p => p.orders, //optional
//     {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
//     @JoinTable({
//       name: 'products',
//       joinColumn: {
//         name: 'orderId',
//         referencedColumnName: 'orderId',
//       },
//       inverseJoinColumn: {
//         name: 'productId',
//         referencedColumnName: 'productId',
//       },
//     })
//     products: Product[];

    @ManyToOne(() => User, (u) => u.orders)
    @JoinColumn({
      name: 'userId',
      referencedColumnName: 'userId'
    })
    user: User;

    @ManyToOne(() => Table, (p) => p.orders)
    @JoinColumn({
      name: 'tableId',
      referencedColumnName: 'tableId'
    })
    table: Table;

    @OneToOne(() => Status, (s) => s.order)
    @JoinColumn({
      name: "statusId",
      referencedColumnName: 'statusId'
    })
    status: Status;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
