import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { District } from './district.entity';
import { User } from './user.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'Wards' })
export class Ward extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'wardId' })
  wardId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;

  @Column({type: 'int'})
  districtId: number;
  // @MaxLength(11)

  @ManyToOne(() => District, (d) => d.wards)
  @JoinColumn({
    name: 'districtId',
    // referencedColumnName: 'districtId'
  })
  district: District;

  @OneToOne(() => User, (u) => u.ward)
  user: User;

  @OneToOne(() => Supplier, (s) => s.ward)
  supplier: Supplier;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
