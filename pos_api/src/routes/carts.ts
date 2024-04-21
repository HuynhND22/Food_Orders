import express from 'express';

import cartController from '../controllers/cart.controller';
import validateCart from '../middleware/validators/cartsValidator';

const router = express.Router();

router.get('/id/:tableId', cartController.getByTableId);
router.post('/create/', validateCart, cartController.create);
router.patch('/update/:id', cartController.update);
router.delete('/delete/:tableId', cartController.hardDelete);

export default router;
