import express from 'express';

import tableController from '../controllers/table.controller';
import validateTable from '../middleware/validators/tablesValidator';

const router = express.Router();

router.get('/all', tableController.getAll);
router.get('/id/:id', tableController.getById);
router.post('/create/', validateTable, tableController.create);
router.patch('/update/:id', validateTable, tableController.update);
router.delete('/remove/:id', tableController.softDelete);
router.delete('/delete/:id', tableController.hardDelete);
router.get('/deleted/', tableController.getDeleted);
router.post('/restore/:id', tableController.restore);
router.get('/check/unique', tableController.checkTableUnique);
router.get('/name/:name', tableController.getbyName);
router.get('/download', tableController.downloadImage);

export default router;
