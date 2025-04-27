import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { User } from './user.entity';

@Entity({ name: 'activate_users' }) // PostgreSQL thường dùng snake_case cho tên bảng
export class ActivateUser {
  @PrimaryColumn({ name: 'email' })
  email: string;

  @IsNotEmpty()
  @Column({ name: 'code', type: 'int' })
  code: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @OneToOne(() => User, (u) => u.activateUser)
  @JoinColumn({ name: 'email' })
  user: User;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
