import express from 'express';
import ChatController from '../controllers/chat/ChatController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

console.log("✅ Loaded ChatController");
console.log("🚀 Available ChatController Methods:", Object.keys(ChatController));

// ✅ בדיקה שה-ChatController מכיל את כל המתודות הדרושות
if (!ChatController.add_customer_friend) console.error("❌ add_customer_friend is missing!");
if (!ChatController.customer_message_add) console.error("❌ customer_message_add is missing!");
if (!ChatController.get_customers) console.error("❌ get_customers is missing!");
if (!ChatController.get_customers_seller_message) console.error("❌ get_customers_seller_message is missing!");
if (!ChatController.get_sellers) console.error("❌ get_sellers is missing!");
if (!ChatController.seller_admin_message_insert) console.error("❌ seller_admin_message_insert is missing!");
if (!ChatController.get_admin_messages) console.error("❌ get_admin_messages is missing!");
if (!ChatController.get_seller_messages) console.error("❌ get_seller_messages is missing!");

// ✅ Customer Routes
router.post('/chat/customer/add-customer-friend', ChatController.add_customer_friend);
router.post('/chat/customer/send-message-to-seller', ChatController.customer_message_add);

// ✅ Seller Routes
router.get('/chat/seller/get-customers/:sellerId', ChatController.get_customers);
router.get('/chat/seller/get-customer-message/:customerId', authMiddleware, ChatController.get_customers_seller_message);
router.post('/chat/seller/send-message-to-customer', authMiddleware, ChatController.customer_message_add); // 🔥 תוקן כאן!

// ✅ Admin Routes
router.get('/chat/admin/get-sellers', authMiddleware, ChatController.get_sellers);
router.post('/chat/message-send-seller-admin', authMiddleware, ChatController.seller_admin_message_insert);
router.get('/chat/get-admin-messages/:receverId', authMiddleware, ChatController.get_admin_messages);
router.get('/chat/get-seller-messages', authMiddleware, ChatController.get_seller_messages);

console.log("🚀 Final ChatController Methods:", Object.keys(ChatController));

export default router;
// Compare this snippet from server.js: