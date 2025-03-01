import express from 'express';
import authControllers from '../controllers/authControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/admin-login', authControllers.admin_login);
router.get('/get-user', authMiddleware, authControllers.getUser);
router.post('/seller-register', authControllers.seller_register);
router.post('/seller-login', authControllers.seller_login);
router.post('/profile-image-upload', authMiddleware, authControllers.profile_image_upload);
router.post('/profile-info-add', authMiddleware, authControllers.profile_info_add);
router.post('/change-password', authMiddleware, authControllers.change_password);
router.get('/logout', authMiddleware, authControllers.logout);

export default router;
// Compare this snippet from Ecommerce/backend/routes/authRoutes.js: