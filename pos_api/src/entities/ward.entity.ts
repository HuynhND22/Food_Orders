import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { District } from './district.entity';
import { User } from './user.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'wards' }) // Dùng snake_case cho tên bảng
export class Ward extends BaseEntity {
  @PrimaryColumn({ name: 'ward_id' }) // Dùng snake_case cho tên cột
  wardId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 }) // Sử dụng varchar thay vì nvarchar
  name: string;

  @Column({ name: 'district_id', type: 'int' })
  districtId: number;

  @ManyToOne(() => District, (d) => d.wards)
  @JoinColumn({
    name: 'district_id',
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
