import express from 'express';
import authControllers from '../controllers/authControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// כניסת אדמין
router.post('/admin-login', authControllers.admin_login);
// קבלת פרטי משתמש (אדמין/מוכר)
router.get('/get-user', authMiddleware, authControllers.getUser);

// נתיבי רישום וכניסה למוכר – שימו לב שהשמות כאן הם "seller-...", כך שהנתיבים יהיו:
router.post('/seller-register', authControllers.customer_register);
router.post('/seller-login', authControllers.customer_login);

// העלאת תמונת פרופיל, עדכון פרטי חנות, שינוי סיסמה, יציאה – מוגנים באימות
router.post('/profile-image-upload', authMiddleware, authControllers.profile_image_upload);
router.post('/profile-info-add', authMiddleware, authControllers.profile_info_add);
router.post('/change-password', authMiddleware, authControllers.change_password);
router.get('/logout', authMiddleware, authControllers.logout);

export default router;
