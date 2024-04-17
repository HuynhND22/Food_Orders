import { BaseEntity, BeforeInsert, BeforeUpdate, Check, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VirtualColumn } from 'typeorm';
import { IsIn, IsNotEmpty, MaxLength, validateOrReject } from 'class-validator';
import { Status } from './status.entity';
import { Ward } from './ward.entity';
import { Order } from './order.entity';
import { ResetPassword } from './resetPasswor.entity';
import { ActivateUser } from './activateUser.entity';


@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'userId' })
  userId: number;
  // @MaxLength(11)
  @IsNotEmpty()

  @Column({type: 'nvarchar', length: 255 })
  firstName: string;

  @Column({type: 'nvarchar', length: 255 })
  lastName: string;
  
  @VirtualColumn({ query: () => `SELECT CONCAT(firstName, ' ', lastName) AS fullName FROM users;` })
  fullName: string;

  @Column({type: 'nvarchar', length: 11, default: 'Nam'})
  @IsIn(['Nam', 'Nữ'])
  gender: string;
  
  @Column({unique: true ,type: 'nvarchar', length: 255 })
  email: string;
  
  @Column({unique: true ,type: 'nvarchar', length: 15, nullable: true })
  phoneNumber?: string;

  @Column({type: 'nvarchar', length: 255, nullable: true })
  address: string;

  @Column({type: 'int', nullable: true})
  wardId?: number;
  // @MaxLength(11)

  @Column({type: 'int'})
  statusId: number;
  // @MaxLength(11)

  @Column({type: 'nvarchar', length: 11, default: ["N'Nhân viên'"]})
  @IsIn(['Quản trị viên', 'Nhân viên'])
  role: string;

  @CreateDateColumn({type: 'datetime', default: () => "GETUTCDATE()"})
  createdAt: String;

  @UpdateDateColumn({ type: "datetime", default: () => "GETUTCDATE()", nullable:true, onUpdate: "GETUTCDATE()" })
  updatedAt?: String;

  @DeleteDateColumn({nullable: true})
  deletedAt?: String;

  @ManyToOne(() => Status, (s) => s.users)
  @JoinColumn({
    name: "statusId",
    referencedColumnName: 'statusId'
  })
  status: Status;

  @ManyToOne(() => Ward, (w) => w.users)
  @JoinColumn({
    name: 'wardId',
  })
  ward: Ward;

  @OneToMany(() => Order, (o) => o.user)
  @JoinColumn({
    name: 'userId'
  })
  orders: Order[];

  @OneToOne(() => ResetPassword, (rp) => rp.user)
  resetPassword: ResetPassword;

  @OneToOne(() => ActivateUser, (rp) => rp.user)
  activateUser: ActivateUser;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
