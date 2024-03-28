import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Ward } from './ward.entity';
import { Province } from './province.entity';

@Entity({ name: 'Districts' })
export class District extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'districtId' })
  districtId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  name: string;

  @Column({type: 'int'})
  provinceId: number;
  // @MaxLength(11)

  @OneToMany(() => Ward, (w) => w.district)
  @JoinColumn({
    name: 'districtId',
    // referencedColumnName: 'districtId'
  })
  wards: Ward[];

  @ManyToOne(()=> Province, (p) => p.districts)
  @JoinColumn({
    name: 'provinceId',
    // referencedColumnName: 'provinceId'
  })
  province: Province;
  
  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
