import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { Ward } from './ward.entity';

@Entity({ name: 'suppliers' })
export class Supplier extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'supplier_id' })
  supplierId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255, name: 'email' })
  email: string;

  @Column({ unique: true, type: 'varchar', length: 15, nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'address' })
  address: string;

  @Column({ type: 'int', nullable: true, name: 'ward_id' })
  wardId?: number;

  @Column({ type: 'int', name: 'status_id' })
  statusId: number;

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", name: 'created_at' })
  createdAt: String;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", nullable: true, onUpdate: "CURRENT_TIMESTAMP", name: 'updated_at' })
  updatedAt?: String;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: String;

  @OneToMany(() => Product, (p) => p.supplier)
  products: Product[];

  @ManyToOne(() => Ward, (w) => w.suppliers)
  @JoinColumn({
    name: 'ward_id',
    referencedColumnName: 'wardId'
  })
  ward: Ward;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
