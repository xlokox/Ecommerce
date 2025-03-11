import express from 'express';
import customerAuthController from '../../controllers/home/customerAuthController.js';

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

export default router;
