import express from 'express';

import promotionController from '../controllers/promotion.controller';
import validatePromotion from '../middleware/validators/promotionsValidator';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.get('/all', promotionController.getAll);
router.get('/id/:id', promotionController.getById);
router.post('/create/', isLogin, isAdmin, validatePromotion, promotionController.create);
router.patch('/update/:id', isLogin, isAdmin, validatePromotion, promotionController.update);
router.delete('/remove/:id', isLogin, isAdmin, promotionController.softDelete);
router.get('/deleted/', isLogin, isAdmin, promotionController.getDeleted);
router.post('/restore/:id', isLogin, isAdmin, promotionController.restore);
router.delete('/delete/:id', isLogin, isAdmin, promotionController.hardDelete);
router.get('/check/unique', promotionController.checkPromotionUnique);
router.get('/client', promotionController.client);

export default router;
