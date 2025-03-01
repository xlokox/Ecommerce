import express from 'express';
import homeControllers from '../../controllers/home/homeControllers.js'; // חובה להוסיף `.js` בסוף!

const router = express.Router();

router.get('/get-categorys', homeControllers.get_categorys);
router.get('/get-products', homeControllers.get_products);
router.get('/price-range-latest-product', homeControllers.price_range_product);
router.get('/query-products', homeControllers.query_products);
router.get('/product-details/:slug', homeControllers.product_details);

router.post('/customer/submit-review', homeControllers.submit_review);
router.get('/customer/get-reviews/:productId', homeControllers.get_reviews);

export default router; // ✅ חובה להשתמש ב-export default