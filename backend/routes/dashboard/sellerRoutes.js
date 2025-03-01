import express from 'express';
import sellerController from '../../controllers/dasboard/sellerController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/request-seller-get', authMiddleware, sellerController.request_seller_get);
router.get('/get-seller/:sellerId', authMiddleware, sellerController.get_seller);
router.post('/seller-status-update', authMiddleware, sellerController.seller_status_update);
router.get('/get-sellers', authMiddleware, sellerController.get_active_sellers);
router.get('/get-deactive-sellers', authMiddleware, sellerController.get_deactive_sellers);

export default router;
// Compare this snippet from Ecommerce/backend/routes/dashboard/sellerRoutes.js: