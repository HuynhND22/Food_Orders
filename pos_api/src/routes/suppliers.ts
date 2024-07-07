import express from 'express';

import supplierController from '../controllers/supplier.Controller';
import validateSupplier from '../middleware/validators/suppliersValidator';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.get('/all', supplierController.getAll);
router.get('/id/:id', isLogin, isAdmin, supplierController.getById);
router.post('/create/', isLogin, isAdmin, validateSupplier, supplierController.create);
router.patch('/update/:id', isLogin, isAdmin, validateSupplier, supplierController.update);
router.delete('/remove/:id', isLogin, isAdmin, supplierController.softDelete);
router.get('/deleted/', isLogin, isAdmin, supplierController.getDeleted);
router.post('/restore/:id', isLogin, isAdmin, supplierController.restore);
router.delete('/delete/:id', isLogin, isAdmin, supplierController.hardDelete);
router.get('/check/unique', isLogin, isAdmin, supplierController.checkSupplierUnique);

export default router;
