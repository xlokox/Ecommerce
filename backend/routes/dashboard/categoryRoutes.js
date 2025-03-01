import express from 'express';
import categoryController from '../../controllers/dasboard/categoryController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/category-add', authMiddleware, categoryController.add_category);
router.get('/category-get', authMiddleware, categoryController.get_category);
router.put('/category-update/:id', authMiddleware, categoryController.update_category);
router.delete('/category/:id', categoryController.deleteCategory);

export default router;
