import express from 'express';

import orderController from '../controllers/order.controller';
// import validatePromotion from '../middleware/validators/promotionsValidator';

const router = express.Router();

router.get('/all', orderController.getAll);
router.get('/id/:id', orderController.getById);
router.post('/create/',  orderController.create);
router.put('/update/:id',  orderController.update);
router.delete('/remove/:id', orderController.softDelete);
router.get('/deleted/', orderController.getDeleted);
router.post('/restore/:id', orderController.restore);
// router.delete('/delete/:id', orderController.hardDelete);

export default router;
