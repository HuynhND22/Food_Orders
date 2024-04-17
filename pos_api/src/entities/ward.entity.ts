import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { District } from './district.entity';
import { User } from './user.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'Wards' })
export class Ward extends BaseEntity {
  @PrimaryColumn({ primaryKeyConstraintName: 'wardId' })
  wardId: number;
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;

  @Column({type: 'int'})
  districtId: number;

  @ManyToOne(() => District, (d) => d.wards)
  @JoinColumn({
    name: 'districtId'
  })
  district: District;

  @OneToMany(() => User, (u) => u.ward)
  users: User[];

  @OneToMany(() => Supplier, (s) => s.ward)
  suppliers: Supplier[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
