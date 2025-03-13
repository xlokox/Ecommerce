import express from 'express';
import authControllers from '../controllers/authControllers.js';
import customerAuthController from '../controllers/home/customerAuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔍 בדיקות הדפסה
console.log("🔍 authControllers:", authControllers);
console.log("🔍 customerAuthController:", customerAuthController);

// 🔹 כניסת אדמין
router.post('/admin-login', authControllers.admin_login);

// 🔹 קבלת פרטי משתמש (אדמין/מוכר)
router.get('/get-user', authMiddleware, authControllers.getUser);

// 🔹 נתיבי רישום וכניסה למוכר
if (authControllers.seller_register && authControllers.seller_login) {
    router.post('/seller-register', authControllers.seller_register);
    router.post('/seller-login', authControllers.seller_login);
} else {
    console.error("❌ seller_register או seller_login אינם מוגדרים");
}

// 🔹 נתיבי רישום וכניסה ללקוח
if (customerAuthController.customer_register && customerAuthController.customer_login) {
    router.post('/customer-register', customerAuthController.customer_register);
    router.post('/customer-login', customerAuthController.customer_login);
} else {
    console.error("❌ customer_register או customer_login אינם מוגדרים");
}

// 🔹 נתיבים נוספים - ווידוא שהפונקציות קיימות
if (authControllers.profile_image_upload && authControllers.profile_info_add && authControllers.change_password) {
    router.post('/profile-image-upload', authMiddleware, authControllers.profile_image_upload);
    router.post('/profile-info-add', authMiddleware, authControllers.profile_info_add);
    router.post('/change-password', authMiddleware, authControllers.change_password);
} else {
    console.error("❌ אחת מהפונקציות profile_image_upload, profile_info_add, change_password אינה מוגדרת");
}

// 🔹 התנתקות
if (customerAuthController.customer_logout) {
    router.get('/logout', authMiddleware, customerAuthController.customer_logout);
} else {
    console.error("❌ customer_logout אינו מוגדר");
}

export default router;
