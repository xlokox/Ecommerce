import express from 'express';
import productController from '../../controllers/dasboard/productController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
const router = express.Router();

// ✅ FIXED: Add authentication back and add delete functionality
router.post('/product-add', authMiddleware, productController.add_product);
router.get('/products-get', authMiddleware, productController.products_get);
router.get('/product-get/:productId', authMiddleware, productController.product_get);
router.post('/product-update', authMiddleware, productController.product_update);
router.post('/product-image-update', authMiddleware, productController.product_image_update);
router.post('/product-images-add', authMiddleware, productController.product_images_add);
router.delete('/product-delete/:productId', authMiddleware, productController.product_delete);

export default router;
