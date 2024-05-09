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

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT),
  username: 'abc123',
  password: "123456789",
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
    ActivateUser
  ],
  synchronize: true,
  logging: true,
  extra: {
    trustServerCertificate: true,
  }
});
