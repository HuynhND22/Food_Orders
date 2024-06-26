import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Product } from './product.entity';

@Entity({ name: 'Images' })
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'imageId' })
  imageId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'int' })
  productId: number;
  // @MaxLength(11)

  @Column({type: 'nvarchar', length:255, nullable: true})
  uri: string;

  @Column({type: 'bit'})
  cover: boolean;

  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'productId',
  })
  product: Product;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
