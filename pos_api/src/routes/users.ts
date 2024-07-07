import express from 'express';

import userController from '../controllers/user.controller';
import validateUser from '../middleware/validators/usersValidator';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.get('/all', isLogin, isAdmin, userController.getAll);
router.get('/id/:id', isLogin, isAdmin, userController.getById);
router.post('/create/', isLogin, isAdmin, validateUser, userController.create);
router.patch('/update/:id', isLogin, isAdmin, userController.update);
router.delete('/remove/:id', isLogin, isAdmin, userController.softDelete);
router.get('/deleted/', isLogin, isAdmin, userController.getDeleted);
router.post('/restore/:id', isLogin, isAdmin, userController.restore);
router.delete('/delete/:id', isLogin, isAdmin, userController.hardDelete);
router.get('/check/unique', isLogin, isAdmin, userController.checkUserUnique);

export default router;
