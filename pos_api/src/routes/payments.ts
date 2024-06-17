import express from 'express';

import paymentController from '../controllers/payment.controller';
import validateBank from '../middleware//validators/banksValidator'

const router = express.Router();

router.post('/handler/:orderId', paymentController.paymentHandler);
router.get('/banks/all', paymentController.getInfo);
router.patch('/banks/update', validateBank, paymentController.updateBank);

export default router;
