import express from 'express';
import cardController from '../../controllers/home/cardController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-to-card', authMiddleware, cardController.add_to_card);
router.get('/get-card-products/:userId', authMiddleware, cardController.get_card_products);
router.delete('/delete-card-products/:card_id', authMiddleware, cardController.delete_card_products);
router.put('/quantity-inc/:card_id', authMiddleware, cardController.quantity_inc);
router.put('/quantity-dec/:card_id', authMiddleware, cardController.quantity_dec);
router.post('/add-wishlist', authMiddleware, cardController.add_wishlist);
router.get('/get-wishlist/:userId', authMiddleware, cardController.get_wishlist);
router.delete('/remove-wishlist/:wishlistId', authMiddleware, cardController.remove_wishlist);

export default router;
