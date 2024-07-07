import express from 'express';

import paymentController from '../controllers/payment.controller';
import validateBank from '../middleware//validators/banksValidator'
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.post('/handler/:orderId', paymentController.paymentHandler);
router.get('/banks/all', paymentController.getInfo);
router.patch('/banks/update',isLogin, isAdmin, validateBank, paymentController.updateBank);

export default router;
