import customerAuthController from '../../controllers/home/customerAuthController.js';
import express from 'express';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await customerAuthController.customer_register(req, res);
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await customerAuthController.customer_login(req, res);
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/logout', async (req, res) => {
  try {
    await customerAuthController.customer_logout(req, res);
  } catch (error) {
    console.error('Error in logout route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
// Compare this snippet from Ecommerce/backend/routes/authRoutes.js: