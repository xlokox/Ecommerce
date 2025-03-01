import { Router } from "express";
import paymentController from '../controllers/payment/paymentController.js';

const router = Router();

router.post("/payment/stripe-connect", paymentController.create_stripe_connect_account);
router.get("/payment/activate/:activeCode", paymentController.active_stripe_connect_account);
router.get("/payment/seller/:sellerId", paymentController.get_seller_payment_details);
router.post("/payment/withdrawal", paymentController.withdrawal_request);
router.get("/payment/request", paymentController.get_payment_request);
router.post("/payment/confirm", paymentController.payment_request_confirm);

export default router; // ✅ זה הפתרון לשגיאה שלך!
