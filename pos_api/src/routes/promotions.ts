import express from 'express';

import promotionController from '../controllers/promotion.controller';
import validatePromotion from '../middleware/validators/promotionsValidator';

const router = express.Router();

router.get('/all', promotionController.getAll);
router.get('/id/:id', promotionController.getById);
router.post('/create/', validatePromotion, promotionController.create);
router.put('/update/:id', validatePromotion, promotionController.update);
router.delete('/remove/:id', promotionController.softDelete);
router.get('/deleted/', promotionController.getDeleted);
router.post('/restore/:id', promotionController.restore);
router.delete('/delete/:id', promotionController.hardDelete);
router.get('/check/unique', promotionController.checkPromotionUnique);


export default router;
