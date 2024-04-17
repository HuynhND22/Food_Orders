import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import {District } from './district.entity';

@Entity({ name: 'Provinces' })
export class Province extends BaseEntity {
  @PrimaryColumn({ primaryKeyConstraintName: 'provinceId' })
  provinceId: number;
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;

  @OneToMany(() => District, (d) => d.province)
  @JoinColumn({
    name: 'provinceId'
  })
  districts: District[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
