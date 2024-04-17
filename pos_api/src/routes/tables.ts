import express from 'express';

import tableController from '../controllers/table.controller';

const router = express.Router();

router.get('/all', tableController.getAll);
router.get('/id/:id', tableController.getById);
router.post('/create/', tableController.create);
router.patch('/update/:id', tableController.update);
router.delete('/remove/:id', tableController.softDelete);
router.get('/deleted/', tableController.getDeleted);
router.post('/restore/:id', tableController.restore);

export default router;
