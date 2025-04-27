import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsIn, IsNotEmpty, validateOrReject } from 'class-validator';
import { Status } from './status.entity';
import { Ward } from './ward.entity';
import { Order } from './order.entity';
import { ResetPassword } from './resetPassword.entity';
import { ActivateUser } from './activateUser.entity';

@Entity({ name: 'users' }) // Dùng snake_case cho tên bảng
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' }) // Dùng snake_case cho tên cột
  userId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, name: 'first_name' }) // Dùng snake_case cho tên cột
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' }) // Dùng snake_case cho tên cột
  lastName: string;

  @Column({ type: 'varchar', length: 11, default: 'Nam', name: 'gender' })
  @IsIn(['Nam', 'Nữ'])
  gender: string;

  @Column({ unique: true, type: 'varchar', length: 255, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password' })
  password: string;

  @Column({ unique: true, type: 'varchar', length: 15, nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'address' })
  address: string;

  @Column({ type: 'int', nullable: true, name: 'ward_id' })
  wardId?: number;

  @Column({ type: 'int', name: 'status_id' })
  statusId: number;

  @Column({ type: 'varchar', length: 20, default: 'Nhân viên', name: 'role' })
  @IsIn(['Quản trị viên', 'Nhân viên'])
  role: string;

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", name: 'created_at' }) // Dùng snake_case
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP", nullable: true, onUpdate: "CURRENT_TIMESTAMP", name: 'updated_at' }) // Dùng snake_case
  updatedAt?: string;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' }) // Dùng snake_case
  deletedAt?: string;

  @ManyToOne(() => Status, (s) => s.users)
  @JoinColumn({
    name: 'status_id',
    referencedColumnName: 'statusId'
  })
  status: Status;

  @ManyToOne(() => Ward, (w) => w.users)
  @JoinColumn({
    name: 'ward_id',
  })
  ward: Ward;

  @OneToMany(() => Order, (o) => o.user)
  @JoinColumn({
    name: 'user_id'
  })
  orders: Order[];

  @OneToOne(() => ResetPassword, (rp) => rp.user)
  resetPassword: ResetPassword;

  @OneToOne(() => ActivateUser, (au) => au.user)
  activateUser: ActivateUser;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
