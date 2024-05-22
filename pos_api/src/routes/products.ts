import express from 'express';

import productController from '../controllers/product.controller';

// import validateProduct from '../middleware/validators/productsValidator';

const router = express.Router();

router.get('/all', productController.getAll);
router.get('/id/:id', productController.getById);
router.post('/create/', productController.create);
router.patch('/update/:id',  productController.update);
router.delete('/remove/:id', productController.softDelete);
router.get('/deleted/', productController.getDeleted);
router.post('/restore/:id', productController.restore);
// router.delete('/delete/:id', productController.hardDelete);
router.get('/check/unique', productController.checkProductUnique);

export default router;
