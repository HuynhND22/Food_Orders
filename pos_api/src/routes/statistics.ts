import express from 'express';
import statisticsController from '../controllers/statistics.controller';
import isLogin from '../middleware/authorizers/checkJWT';

const router = express.Router();

router.get('/orders/date',isLogin, statisticsController.getOrderByDate);
router.get('/status-orders/date',isLogin, statisticsController.getStatusOrderByDate);
// router.get('/districts/:provinceId', addressController.getDistricts);
// router.get('/wards/:districtId', addressController.getWards);

export default router;
