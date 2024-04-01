import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { User } from './user.entity';

@Entity({ name: 'ActivateUsers' })
export class ActivateUser extends BaseEntity {
  @PrimaryColumn()
  email: string;
  @IsNotEmpty()

  @Column({type: 'int'})
  code: number;

  @OneToOne(() => User, (u) => u.activateUser)
  @JoinColumn({
    name: 'email',
  })
  user: User;
  
  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
