import express from 'express';
import orderController from '../../controllers/order/orderController.js'; 

const router = express.Router();

// ✅ Customer Routes
router.post('/home/order/place-order', orderController.place_order);
router.get('/home/customer/get-dashboard-data/:userId', orderController.get_customer_dashboard_data);
router.get('/home/customer/get-orders/:customerId/:status', orderController.get_orders);
router.get('/home/customer/get-order-details/:orderId', orderController.get_order_details);

router.post('/order/create-payment', orderController.create_payment);
router.get('/order/confirm/:orderId', orderController.order_confirm);

// ✅ Admin Routes (ודא שהפונקציות קיימות!)
if (orderController.get_admin_orders) {
    router.get('/admin/orders', orderController.get_admin_orders);
}
if (orderController.get_admin_order) {
    router.get('/admin/order/:orderId', orderController.get_admin_order);
}
if (orderController.admin_order_status_update) {
    router.put('/admin/order-status/update/:orderId', orderController.admin_order_status_update);
}

// ✅ Seller Routes (ודא שהפונקציות קיימות!)
if (orderController.get_seller_orders) {
    router.get('/seller/orders/:sellerId', orderController.get_seller_orders);
}
if (orderController.get_seller_order) {
    router.get('/seller/order/:orderId', orderController.get_seller_order);
}
if (orderController.seller_order_status_update) {
    router.put('/seller/order-status/update/:orderId', orderController.seller_order_status_update);
}

export default router;
