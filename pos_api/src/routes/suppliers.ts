import express from 'express';

import supplierController from '../controllers/supplier.Controller';
import validateSupplier from '../middleware/validators/suppliersValidator';

const router = express.Router();

router.get('/all', supplierController.getAll);
router.get('/id/:id', supplierController.getById);
router.post('/create/', validateSupplier, supplierController.create);
router.patch('/update/:id', validateSupplier, supplierController.update);
router.delete('/remove/:id', supplierController.softDelete);
router.get('/deleted/', supplierController.getDeleted);
router.post('/restore/:id', supplierController.restore);
router.delete('/delete/:id', supplierController.hardDelete);
router.get('/check/unique', supplierController.checkSupplierUnique);

export default router;
