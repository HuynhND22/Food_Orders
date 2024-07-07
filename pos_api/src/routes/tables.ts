import express from 'express';

import tableController from '../controllers/table.controller';
import validateTable from '../middleware/validators/tablesValidator';
import isLogin from '../middleware/authorizers/checkJWT';
import isAdmin from '../middleware/authorizers/isAdmin';

const router = express.Router();

router.get('/all', tableController.getAll);
router.get('/id/:id', tableController.getById);
router.post('/create/',isLogin, isAdmin, validateTable, tableController.create);
router.patch('/update/:id', isLogin, isAdmin, validateTable, tableController.update);
router.delete('/remove/:id', isLogin, isAdmin, tableController.softDelete);
router.delete('/delete/:id', isLogin, isAdmin, tableController.hardDelete);
router.get('/deleted/', isLogin, isAdmin, tableController.getDeleted);
router.post('/restore/:id', isLogin, isAdmin, tableController.restore);
router.get('/check/unique', tableController.checkTableUnique);
router.get('/name/:name', tableController.getbyName);
router.get('/download', tableController.downloadImage);

export default router;
