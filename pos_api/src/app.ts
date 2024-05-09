import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';

import { AppDataSource } from './data-source';
import indexRouter from './routes/index';
import categoriesRouter from './routes/categories';
import tablesRouter from './routes/tables';
import userRouter from './routes/users';
import cartRouter from './routes/carts';
import addressRouter from './routes/address';
import promotionRouter from './routes/promotions';
import paymentRouter from './routes/payments';
import suppliersRouter from './routes/suppliers';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import authRouter from './routes/authentications';

const app: Express = express();

AppDataSource.initialize().then(async () => {
  console.log('Data source was initialized');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.resolve('./public')));

  // use cors
  app.use(cors({ origin: '*' }));

  app.use('/api/', indexRouter);
  app.use('/categories', categoriesRouter);
  app.use('/tables', tablesRouter);
  app.use('/users', userRouter);
  app.use('/carts', cartRouter);
  app.use('/address', addressRouter);
  app.use('/promotions', promotionRouter);
  app.use('/payments', paymentRouter);
  app.use('/suppliers', suppliersRouter);
  app.use('/products', productsRouter);
  app.use('/orders', ordersRouter);
  app.use('/auth', authRouter);

  // catch 404 and forward to error handler
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send('Not found');
    // next(createError(404));
  });

  // error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

export default app;
