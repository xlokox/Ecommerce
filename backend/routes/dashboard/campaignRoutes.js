import express from 'express';
import campaignController from '../../controllers/dasboard/campaignController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Simple role check helper (admin only for mutations)
const requireRole = (allowed) => (req, res, next) => {
  if (!allowed.includes(req.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};

// Public route for website/mobile hero (MUST be declared before '/campaigns/:id')
router.get('/campaigns/public', campaignController.publicList);

// Admin routes
router.post('/campaigns', authMiddleware, requireRole(['admin','seller']), campaignController.create);
router.put('/campaigns/:id', authMiddleware, requireRole(['admin','seller']), campaignController.update);
router.delete('/campaigns/:id', authMiddleware, requireRole(['admin','seller']), campaignController.remove);
router.get('/campaigns', authMiddleware, requireRole(['admin','seller']), campaignController.list);
router.get('/campaigns/:id', authMiddleware, requireRole(['admin','seller']), campaignController.get);

export default router;

