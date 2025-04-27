import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Table } from './table.entity';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'carts' }) // Đổi tên bảng theo convention PostgreSQL
@Check('quantity > 0') // PostgreSQL dùng CHECK trực tiếp thế này
export class Cart {
  @PrimaryGeneratedColumn({ name: 'cart_id', type: 'int' })
  cartId: number;

  @Column({ name: 'table_id', type: 'int' })
  tableId: number;

  @Column({ name: 'product_size_id', type: 'int', nullable: true })
  productSizeId: number | null;

  @Column({ name: 'promotion_id', type: 'int', nullable: true })
  promotionId: number | null;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @ManyToOne(() => Table, (t) => t.carts)
  @JoinColumn({ name: 'table_id', referencedColumnName: 'tableId' })
  table: Table;

  @ManyToOne(() => ProductSize, (p) => p.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_size_id' })
  productSize: ProductSize; // Trả về một đối tượng thay vì mảng

  @ManyToOne(() => Promotion, (pr) => pr.carts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promotion_id' })
  promotion: Promotion;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
