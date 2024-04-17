import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Ward } from './ward.entity';
import { Province } from './province.entity';

@Entity({ name: 'Districts' })
export class District extends BaseEntity {
  @PrimaryColumn({ primaryKeyConstraintName: 'districtId' })
  districtId: number;
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;

  @Column({type: 'int'})
  provinceId: number;

  @OneToMany(() => Ward, (w) => w.district)
  @JoinColumn({
    name: 'districtId'
  })
  wards: Ward[];

  @ManyToOne(()=> Province, (p) => p.districts)
  @JoinColumn({
    name: 'provinceId'
  })
  province: Province;
  
  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
