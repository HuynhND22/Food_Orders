import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { District } from './district.entity';

@Entity({ name: 'provinces' }) // PostgreSQL uses snake_case
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'province_id' }) // Changed to snake_case
  provinceId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 }) // Changed to varchar for PostgreSQL
  name: string;

  @OneToMany(() => District, (d) => d.province)
  @JoinColumn({
    name: 'province_id', // Changed to snake_case
  })
  districts: District[];

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
