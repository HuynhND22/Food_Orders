import express from 'express';
import sizeController from '../controllers/size.controller';


const router = express.Router();

router.get('/all', sizeController.getSize);

export default router;
