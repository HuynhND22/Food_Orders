import express from 'express';

import categoryController from '../controllers/category.controller';
import validateCategory from '../middleware/validators/categoriesValidator';

const router = express.Router();

router.get('/all', categoryController.getAll);
router.get('/id/:id', categoryController.getById);
router.post('/create/', validateCategory, categoryController.create);
router.patch('/update/:id', validateCategory, categoryController.update);
router.delete('/remove/:id', categoryController.softDelete);
router.get('/deleted/', categoryController.getDeleted);
router.post('/restore/:id', categoryController.restore);
router.delete('/delete/:id', categoryController.hardDelete);
router.get('/check/unique', categoryController.checkCategoryUnique);

export default router;
