import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import {District } from './district.entity';

@Entity({ name: 'Provinces' })
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'provinceId' })
  provinceId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;

  @OneToMany(() => District, (d) => d.province)
  @JoinColumn({
    name: 'provinceId',
    // referencedColumnName: 'provinceId',
  })
  districts: District[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
