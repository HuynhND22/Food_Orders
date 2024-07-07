import express from 'express';

import categoryController from '../controllers/category.controller';
import validateCategory from '../middleware/validators/categoriesValidator';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.get('/all', categoryController.getAll);
router.get('/id/:id', categoryController.getById);
router.post('/create/', validateCategory, isLogin, isAdmin, categoryController.create);
router.patch('/update/:id', validateCategory, isLogin, isAdmin, categoryController.update);
router.delete('/remove/:id',isLogin, isAdmin, categoryController.softDelete);
router.get('/deleted/', categoryController.getDeleted);
router.post('/restore/:id',isLogin, isAdmin, categoryController.restore);
router.delete('/delete/:id',isLogin, isAdmin, categoryController.hardDelete);
router.get('/check/unique', categoryController.checkCategoryUnique);

export default router;
