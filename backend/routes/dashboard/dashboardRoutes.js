// backend/routes/dashboard/dashboardRoutes.js
import express from 'express';
import dashboardController from '../../controllers/dasboard/dashboardController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// middleware שבודק תפקידים
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};

/**
 * ADMIN-only routes
 */
router.get(
  '/admin/get-dashboard-data',
  authMiddleware,
  requireRole(['admin']),
  dashboardController.get_admin_dashboard_data
);

// הוספת/עדכון באנרים היא רק ל‑admin
router.post(
  '/banner/add',
  authMiddleware,
  requireRole(['admin']),
  dashboardController.add_banner
);
router.get(
  '/banner/get/:productId',
  authMiddleware,
  requireRole(['admin']),
  dashboardController.get_banner
);
router.put(
  '/banner/update/:bannerId',
  authMiddleware,
  requireRole(['admin']),
  dashboardController.update_banner
);

/**
 * SELLER-only routes
 */
router.get(
  '/seller/get-dashboard-data',
  authMiddleware,
  requireRole(['seller']),
  dashboardController.get_seller_dashboard_data
);

/**
 * Public route (לא צריך בדיקת תפקיד)
 */
router.get('/banners', dashboardController.get_banners);

export default router;
