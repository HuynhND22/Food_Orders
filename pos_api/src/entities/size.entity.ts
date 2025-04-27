import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { ProductSize } from './productSize.entity';

@Entity({ name: 'sizes' }) // Tên bảng theo chuẩn snake_case
export class Size extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'size_id' }) // Chuyển tên cột thành snake_case
  sizeId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, unique: true }) // Sử dụng varchar thay vì nvarchar
  name: string;

  @OneToMany(() => ProductSize, (ps) => ps.size)
  productSizes: ProductSize[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
