import express from 'express';
import statusController from '../controllers/status.controller';


const router = express.Router();

router.get('/:feature', statusController.getStatus);

export default router;
