import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { User } from './user.entity';

@Entity({ name: 'reset_passwords' })
export class ResetPassword extends BaseEntity {
  @PrimaryColumn({ name: 'email' })
  email: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, name: 'token' })
  token: string;

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => User, (u) => u.resetPassword)
  @JoinColumn({
    name: 'email',
  })
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
