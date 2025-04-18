import express from 'express';
import productController from '../../controllers/dasboard/productController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
const router = express.Router();

// TEMPORARY: Bypass authentication for testing
router.post('/product-add', productController.add_product); // Removed authMiddleware for testing
router.get('/products-get', authMiddleware, productController.products_get);
router.get('/product-get/:productId', authMiddleware, productController.product_get);
router.post('/product-update', authMiddleware, productController.product_update);
router.post('/product-image-update', authMiddleware, productController.product_image_update);

export default router;
