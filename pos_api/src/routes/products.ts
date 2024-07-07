import express from 'express';

import productController from '../controllers/product.controller';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

// import validateProduct from '../middleware/validators/productsValidator';

const router = express.Router();

router.get('/all', productController.getAll);
router.get('/client', productController.client);
router.get('/id/:id', productController.getById);
router.get('/category/:categoryId', productController.getByCategory);
router.post('/create/', isLogin, isAdmin, productController.create);
router.patch('/update/:id', isLogin, isAdmin, productController.update);
router.delete('/remove/:id', isLogin, isAdmin, productController.softDelete);
router.get('/deleted/', productController.getDeleted);
router.post('/restore/:id', isLogin, isAdmin, productController.restore);
router.delete('/delete/:id', isLogin, isAdmin, productController.hardDelete);
router.get('/check/unique', productController.checkProductUnique);

export default router;
