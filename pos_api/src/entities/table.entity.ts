import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Status } from './status.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity({ name: 'Tables' })
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'tableId' })
  tableId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'int'})
  seat: number;
  @MaxLength(2)

  @Column({type: 'nvarchar', length:255})
  name: string;

  @Column({type: 'int'})
  statusId?: number;
  // @MaxLength(11)

//   @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
//   createdAt: String;

//   @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
//   updatedAt?: String;

//   @DeleteDateColumn({nullable: true})
//   deletedAt?: String;

  @OneToOne(() => Status, (s) => s.table)
  @JoinColumn({
    name: "statusId",
    referencedColumnName: 'statusId'
  })
  status: Status;

  @OneToMany(() => Order, (o) => o.table)
  @JoinColumn({
    name: 'tableId',
    // referencedColumnName: 'tableId'
  })
  orders: Order[];

  @OneToOne(() => Cart, (s) => s.table)
  cart: Cart;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
