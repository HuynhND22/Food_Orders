require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { OrderDetail } from './entities/orderDetail.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { Supplier } from './entities/supplier.entity';
import { Cart } from './entities/cart.entity';
import { District } from './entities/district.entity';
import { Image } from './entities/image.entity';
import { Promotion } from './entities/promotion.entity';
import { PromotionDetail } from './entities/promotionDetail.entity';
import { Province } from './entities/province.entity';
import { Size } from './entities/size.entity';
import { Status } from './entities/status.entity';
import { Table } from './entities/table.entity';
import { Ward } from './entities/ward.entity';
import { ProductSize } from './entities/productSize.entity';
import { ResetPassword } from './entities/resetPasswor.entity';
import { ActivateUser } from './entities/activateUser.entity';
import {BankInfomation} from './entities//bankInfomation.entity'

import { checkCartsUnique } from './migrations/triggers/checkCartsUnique';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  entities: [
    Cart,
    Status, 
    Category, 
    Supplier, 
    Product, 
    Image, 
    Size, 
    ProductSize, 
    Ward, 
    District, 
    Province, 
    Table, 
    User, 
    Promotion, 
    PromotionDetail, 
    Order, 
    OrderDetail, 
    ResetPassword, 
    ActivateUser,
    BankInfomation
  ],
  migrations: [
    // join(__dirname, '**', '*.\.{ts,js}')
    // "src/migrations/**/*.ts"
    'dist/**/*.entity.ts'
  ],
  // migrations: [
  //   checkCartsUnique
  // ],
  synchronize: true,
  logging: false,
  extra: {
    trustServerCertificate: true,
  }
});
