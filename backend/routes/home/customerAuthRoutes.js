import express from 'express';
import customerAuthController from '../../controllers/home/customerAuthController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// רישום לקוח
router.post('/register', async (req, res) => {
  console.log("📌 Register Route Hit");
  try {
    await customerAuthController.customer_register(req, res);
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// התחברות לקוח
router.post('/login', async (req, res) => {
  console.log("📌 Login Route Hit");
  try {
    await customerAuthController.customer_login(req, res);
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// התנתקות לקוח
router.get('/logout', async (req, res) => {
  console.log("📌 Logout Route Hit");
  try {
    await customerAuthController.customer_logout(req, res);
  } catch (error) {
    console.error('Error in logout route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// קבלת פרופיל לקוח
router.get('/profile', authMiddleware, async (req, res) => {
  console.log("📌 Get Profile Route Hit");
  try {
    await customerAuthController.get_customer_profile(req, res);
  } catch (error) {
    console.error('Error in get profile route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// עדכון פרופיל לקוח
router.put('/profile', authMiddleware, async (req, res) => {
  console.log("📌 Update Profile Route Hit");
  try {
    await customerAuthController.update_customer_profile(req, res);
  } catch (error) {
    console.error('Error in update profile route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// העלאת תמונת פרופיל לקוח
router.post('/profile/image', authMiddleware, async (req, res) => {
  console.log("📌 Upload Profile Image Route Hit");
  try {
    await customerAuthController.upload_customer_image(req, res);
  } catch (error) {
    console.error('Error in upload image route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
