import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';

@Entity({ name: 'Categories' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'categoryId' })
  categoryId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({unique: true, type: 'nvarchar', length: 255 })
  name: string;

  @Column({type: 'nvarchar', length: 255, nullable: true })
  description?: string;

  @Column({type: 'nvarchar', length: 255, nullable: true})
  image?: string;


  @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
