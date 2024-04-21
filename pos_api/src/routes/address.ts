import express from 'express';

import addressController from '../controllers/address.controller';
// import validateCategory from '../middleware/validators/categoriesValidator';

const router = express.Router();

router.get('/provinces', addressController.getProvinces);
router.get('/districts/:provinceId', addressController.getDistricts);
router.get('/wards/:districtId', addressController.getWards);

export default router;
