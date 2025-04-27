import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { validateOrReject, IsNotEmpty } from 'class-validator';
import { Table } from './table.entity';
import { Promotion } from './promotion.entity';
import { ProductSize } from './productSize.entity';
import { Product } from './product.entity';
import { Ward } from './ward.entity';
import { Province } from './province.entity';

@Entity({ name: 'categories' }) // Đổi sang snake_case cho PostgreSQL
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @IsNotEmpty()
  @Column({ name: 'name', unique: true, type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true }) // `onUpdate` không cần thiết ở PostgreSQL
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}

@Entity({ name: 'districts' }) // Đổi tên bảng theo convention PostgreSQL
export class District {
  @PrimaryColumn({ name: 'district_id' }) // Giữ nguyên nếu không muốn tự động tăng
  districtId: number;

  @IsNotEmpty()
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Ward, (w) => w.district)
  wards: Ward[];

  @ManyToOne(() => Province, (p) => p.districts)
  @JoinColumn({ name: 'province_id' }) // Định danh khóa ngoại
  province: Province;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}

@Entity({ name: 'images' }) // PostgreSQL convention
export class Image {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  imageId: number;

  @IsNotEmpty()
  @Column({ name: 'uri', type: 'varchar', length: 255, nullable: true })
  uri: string;

  @Column({ name: 'cover', type: 'boolean' }) // Đổi từ `bit` -> `boolean`
  cover: boolean;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' }) // Liên kết khóa ngoại
  product: Product;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}