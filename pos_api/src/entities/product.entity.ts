import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Category } from './category.entity';
import { Image } from './image.entity';
import { Supplier } from './supplier.entity';
import { Status } from './status.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'Products' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'productId' })
  productId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'int'})
  categoryId: number;
  // @MaxLength(11)

  @Column({type: 'int'})
  supplierId: number;
  // @MaxLength(11)

  @Column({type: 'nvarchar', length: 255, unique: true})
  name: string;
  
  @Column({type: 'nvarchar', length:255, nullable: true})
  description?: string;

  @Column({type: 'int'})
  statusId: number;
  // @MaxLength(11)

  @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  createdAt: String;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @ManyToOne(()=> Category, (c) => c.products)
  @JoinColumn({
    name: 'categoryId',
  })
  category: Category;

  @ManyToOne(()=> Supplier, (s) => s.products)
  @JoinColumn({
    name: 'supplierId',
  })
  supplier: Supplier;

  @OneToMany(() => Image, (i) => i.product, { onDelete: 'CASCADE' })
  images: Image[];

  @OneToMany(() => ProductSize, (s) => s.product, { onDelete: 'CASCADE' })
  productSizes: ProductSize[];

  // @ManyToMany(
  //   () => Order, 
  //   o => o.products, //optional
  //   {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
  //   @JoinTable({
  //     name: 'orderDetails',
  //     joinColumn: {
  //       name: 'productId',
  //       referencedColumnName: 'productId',
  //     },
  //     inverseJoinColumn: {
  //       name: 'orderId',
  //       referencedColumnName: 'orderId',
  //     },
  //   })
    // orders: Order[];

    @ManyToOne(() => Status, (c) => c.products)
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
