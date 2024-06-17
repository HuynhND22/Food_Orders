import express from 'express';

import orderController from '../controllers/order.controller';
import validateOrder from '../middleware/validators/ordersValidator';

const router = express.Router();

router.get('/all', orderController.getAll);
router.get('/id/:id', orderController.getById);
router.get('/table/:id', orderController.getByTableId);
router.post('/create/', validateOrder, orderController.create);
router.post('/cancel/:id', orderController.cancel);
router.patch('/update/:id', validateOrder, orderController.update);
router.delete('/remove/:id', orderController.softDelete);
router.get('/deleted/', orderController.getDeleted);
router.post('/restore/:id', orderController.restore);
// router.delete('/delete/:id', orderController.hardDelete);

export default router;
