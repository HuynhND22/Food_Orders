import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Category } from './category.entity';
import { Image } from './image.entity';
import { Supplier } from './supplier.entity';
import { Status } from './status.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  productId: number;

  @IsNotEmpty()
  @Column({ type: 'int', name: 'category_id' })
  categoryId: number;

  @Column({ type: 'int', name: 'supplier_id' })
  supplierId: number;

  @Column({ type: 'varchar', length: 255, unique: true, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'description' })
  description?: string;

  @Column({ type: 'int', name: 'status_id' })
  statusId: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt?: string;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: string;

  @ManyToOne(() => Category, (c) => c.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Supplier, (s) => s.products)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => Image, (i) => i.product, { onDelete: 'CASCADE' })
  images: Image[];

  @OneToMany(() => ProductSize, (s) => s.product, { onDelete: 'CASCADE' })
  productSizes: ProductSize[];

  @ManyToOne(() => Status, (s) => s.products)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'statusId' })
  status: Status;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
