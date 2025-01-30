import express from 'express';
import RuleController from '../controllers/RuleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, RuleController.createRule);
router.get('/get-all', RuleController.getAllRule);
router.get('/get-detail/:id', authMiddleware, RuleController.getDetailRule);
router.put('/update/:id', authMiddleware, RuleController.updateRule);
router.delete('/delete/:id', authMiddleware, RuleController.deleteRule);

export default router;
