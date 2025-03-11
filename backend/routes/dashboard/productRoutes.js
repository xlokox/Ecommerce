import express from 'express';
import productController from '../../controllers/dasboard/productController.js';
// ניתן להוסיף authMiddleware אם נדרש
const router = express.Router();

router.post('/product-add', productController.add_product);
router.get('/products-get', productController.products_get);
router.get('/product-get/:productId', productController.product_get);
router.post('/product-update', productController.product_update);
router.post('/product-image-update', productController.product_image_update);

export default router;
