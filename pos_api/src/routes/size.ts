import express from 'express';
import sizeController from '../controllers/size.controller';


const router = express.Router();

router.get('/all', sizeController.getSize);
router.get('/product/:id', sizeController.getByProduct);
router.get('/product-size/:id', sizeController.getByProductSize);

export default router;
