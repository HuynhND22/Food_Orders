import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';
import { Ward } from './ward.entity';

@Entity({ name: 'Supplier' })
export class Supplier extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'supplierId' })
  supplierId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;
  
  @Column({unique: true ,type: 'nvarchar', length: 255 })
  email: string;
  
  @Column({ unique: true, type: 'varchar', length: 15, nullable: true })
  phoneNumber?: string; // Sử dụng kiểu dữ liệu string thay vì number
  
  

  @Column({type: 'nvarchar', length: 255, nullable: true })
  address: string;

@Column({type: 'int', nullable: true})
wardId?: number;

  // @MaxLength(11)

  @Column({type: 'int'})
  statusId: number;
  // @MaxLength(11)

  @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  createdAt: String;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @OneToMany(() => Product, (p) => p.supplier)
  products: Product[];

  @ManyToOne(() => Ward, (w) => w.suppliers)
  @JoinColumn({
    name: 'wardId',
    referencedColumnName: 'wardId'
  })
  ward: Ward;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
