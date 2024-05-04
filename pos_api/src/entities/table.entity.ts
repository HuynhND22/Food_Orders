import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Status } from './status.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity({ name: 'Tables' })
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'tableId' })
  tableId: number;
  @IsNotEmpty()

  @Column({type: 'int', default: 2})
  seat: number;
  

  @Column({type: 'nvarchar', length:255, unique: true})
  name: string;

  @Column({type: 'int'})
  statusId?: number;
  // @MaxLength(11)

  @Column({type: 'varchar', nullable:true})
  urlCode: string;

  @Column({type: 'varchar', length:255})
  qrCode: string;

  @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  createdAt: String;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @ManyToOne(() => Status, (s) => s.tables)
  @JoinColumn({
    name: "statusId",
    referencedColumnName: 'statusId'
  })
  status: Status;

  @OneToMany(() => Order, (o) => o.table)
  @JoinColumn({
    name: 'tableId'
  })
  orders: Order[];

  @OneToMany(() => Cart, (s) => s.table)
  carts: Cart[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
