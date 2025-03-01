import express from 'express';
import productController from '../../controllers/dasboard/productController.js';
// import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// נתיב להוספת מוצר (ללא אימות)
router.post('/product-add', productController.add_product);

// נתיב לקבלת רשימת מוצרים (ללא אימות)
router.get('/products-get', productController.products_get);

// נתיב לקבלת מוצר לפי ID (ללא אימות)
router.get('/product-get/:productId', productController.product_get);

// נתיב לעדכון מוצר (ללא אימות)
router.post('/product-update', productController.product_update);

// נתיב לעדכון תמונת מוצר (ללא אימות)
router.post('/product-image-update', productController.product_image_update);

export default router;
