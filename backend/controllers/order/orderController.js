import customerOrder from '../../models/customerOrder.js';
import authOrderModel from '../../models/authOrder.js';
import myShopWallet from '../../models/myShopWallet.js';
import sellerWallet from '../../models/sellerWallet.js';
import cardModel from '../../models/cardModel.js';
import moment from 'moment';
import { responseReturn } from '../../utiles/response.js';
import mongoose from 'mongoose';
import Stripe from 'stripe';

const { ObjectId } = mongoose.Types;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class OrderController {

    // ✅ בדיקה אם התשלום בוצע ואם לא -> ביטול ההזמנה
    paymentCheck = async (id) => {
        try {
            const order = await customerOrder.findById(id);
            if (order && order.payment_status === 'unpaid') {
                await customerOrder.findByIdAndUpdate(id, { delivery_status: 'cancelled' });
                await authOrderModel.updateMany({ orderId: id }, { delivery_status: 'cancelled' });
            }
            return true;
        } catch (error) {
            console.error('Payment Check Error:', error);
        }
    };

    // ✅ ביצוע הזמנה חדשה
    place_order = async (req, res) => {
        try {
            const { price, products, shipping_fee, shippingInfo, userId } = req.body;
            if (!price || !products || !shippingInfo || !userId) {
                return responseReturn(res, 400, { message: 'Missing required fields' });
            }

            const tempDate = moment().format('LLL');
            let customerOrderProduct = [];
            let authorOrderData = [];
            let cardId = [];

            for (const group of products) {
                const { sellerId, price: sellerPrice, products: items } = group;
                let storeProds = [];

                for (const { productInfo, quantity, _id } of items) {
                    productInfo.quantity = quantity;
                    customerOrderProduct.push(productInfo);
                    storeProds.push(productInfo);
                    if (_id) cardId.push(_id);
                }

                authorOrderData.push({
                    orderId: '',
                    sellerId,
                    products: storeProds,
                    price: sellerPrice,
                    payment_status: 'unpaid',
                    shippingInfo: 'Easy Main Warehouse',
                    delivery_status: 'pending',
                    date: tempDate
                });
            }

            const order = await customerOrder.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                payment_status: 'unpaid',
                delivery_status: 'pending',
                date: tempDate
            });

            authorOrderData = authorOrderData.map(orderItem => ({
                ...orderItem,
                orderId: order.id
            }));

            await authOrderModel.insertMany(authorOrderData);
            await cardModel.deleteMany({ _id: { $in: cardId } });

            setTimeout(() => this.paymentCheck(order.id), 15000);

            responseReturn(res, 200, { message: 'Order Placed Successfully', orderId: order.id });

        } catch (error) {
            console.error('Place Order Error:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    };

    // ✅ שליפת מידע על הדאשבורד של הלקוח
    get_customer_dashboard_data = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!ObjectId.isValid(userId)) {
                return responseReturn(res, 400, { message: 'Invalid user ID' });
            }

            const [recentOrders, pendingOrder, totalOrder, cancelledOrder] = await Promise.all([
                customerOrder.find({ customerId: new ObjectId(userId) }).limit(5),
                customerOrder.countDocuments({ customerId: new ObjectId(userId), delivery_status: 'pending' }),
                customerOrder.countDocuments({ customerId: new ObjectId(userId) }),
                customerOrder.countDocuments({ customerId: new ObjectId(userId), delivery_status: 'cancelled' })
            ]);

            responseReturn(res, 200, { recentOrders, pendingOrder, totalOrder, cancelledOrder });

        } catch (error) {
            console.error('Dashboard Data Error:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    };

    // ✅ שליפת כל ההזמנות של משתמש מסוים
    get_orders = async (req, res) => {
        try {
            const { customerId, status } = req.params;
            if (!ObjectId.isValid(customerId)) {
                return responseReturn(res, 400, { message: 'Invalid customer ID' });
            }

            const filter = { customerId: new ObjectId(customerId) };
            if (status !== 'all') filter.delivery_status = status;

            const orders = await customerOrder.find(filter);
            responseReturn(res, 200, { orders });

        } catch (error) {
            console.error('Get Orders Error:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    };

    // ✅ שליפת פרטי הזמנה לפי ID
    get_order_details = async (req, res) => {
        try {
            const { orderId } = req.params;
            if (!ObjectId.isValid(orderId)) {
                return responseReturn(res, 400, { message: 'Invalid order ID' });
            }

            const order = await customerOrder.findById(orderId);
            responseReturn(res, 200, { order });

        } catch (error) {
            console.error('Get Order Details Error:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    };

    // ✅ יצירת תשלום
    create_payment = async (req, res) => {
        try {
            const { price } = req.body;
            if (!price) return responseReturn(res, 400, { message: 'Missing price field' });

            const payment = await stripe.paymentIntents.create({
                amount: price * 100,
                currency: 'usd',
                automatic_payment_methods: { enabled: true }
            });

            responseReturn(res, 200, { clientSecret: payment.client_secret });

        } catch (error) {
            console.error('Create Payment Error:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    };

    // ✅ אישור תשלום לאחר הזמנה
    order_confirm = async (req, res) => {
        try {
            const { orderId } = req.params;
            if (!ObjectId.isValid(orderId)) {
                return responseReturn(res, 400, { message: 'Invalid order ID' });
            }

            await customerOrder.findByIdAndUpdate(orderId, { payment_status: 'paid' });
            await authOrderModel.updateMany({ orderId: new ObjectId(orderId) }, { payment_status: 'paid', delivery_status: 'pending' });

            const time = moment().format('L');
            const [month, , year] = time.split('/');

            responseReturn(res, 200, { message: 'Order Confirmed Successfully' });

        } catch (error) {
            console.error('Order Confirm Error:', error);
            responseReturn(res, 500, { message: 'Internal Server Error' });
        }
    };
}

export default new OrderController();
