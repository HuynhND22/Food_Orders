import express from 'express';

import orderController from '../controllers/order.controller';
import isLogin from '../middleware/authorizers/checkJWT';
import validateOrder from '../middleware/validators/ordersValidator';

const router = express.Router();

router.get('/all', orderController.getAll);
router.get('/id/:id', orderController.getById);
router.get('/table/:id', orderController.getByTableId);
router.post('/create/', validateOrder, orderController.create);
router.post('/cancel/:id', orderController.cancel);
router.patch('/update/:id', isLogin, validateOrder, orderController.update);
router.delete('/remove/:id',isLogin, orderController.softDelete);
router.get('/deleted/', orderController.getDeleted);
router.post('/restore/:id', isLogin, orderController.restore);
router.patch('/update/status/:id', isLogin, orderController.updateStatus);
router.get('/total-price/:id', orderController.getTotalPrice);

export default router;
