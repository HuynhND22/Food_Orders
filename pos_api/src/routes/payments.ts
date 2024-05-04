import express from 'express';

import paymentController from '../controllers/payment.controller';

const router = express.Router();

router.get('/handler/:orderId', paymentController.paymentHandler);

export default router;
