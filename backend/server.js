// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { dbConnect } from './utiles/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

// מוסיפים כאן את Cloudinary – הגדרה פעם אחת בלבד
import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true
});

// (לא חובה, אבל עוזר לבדיקה)
console.log('cloud_name:', process.env.cloud_name);
console.log('api_key:', process.env.api_key);
console.log('api_secret:', process.env.api_secret);

// goodies – לפי מה שהיה לך קודם
console.log('🚀 Available ChatController Methods: [...]');
console.log('🚀 Final ChatController Methods: [...]');

// יצירת אובייקט express ו־HTTP server
const app = express();
const server = createServer(app);

import { securityMiddleware, validateRequest } from './middlewares/securityMiddleware.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { loggingMiddleware } from './middlewares/loggingMiddleware.js';

// Security middleware
app.use(securityMiddleware);

// CORS with secure configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400 // 24 hours
}));

// Add logging middleware
app.use(loggingMiddleware);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Protected routes
app.use('/api/payment', validateRequest, authMiddleware);
app.use('/api/order', validateRequest, authMiddleware);
app.use('/api/chat', validateRequest, authMiddleware);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// הגדרת Socket.io עם אפשרויות CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// משתנים לניהול חיבורי סוקט – לקוחות, מוכרים ומנהל
let allCustomer = [];
let allSeller = [];
let admin = {};

// פונקציות העזר שהיו לך
const addUser = (customerId, socketId, userInfo) => {
  if (!allCustomer.some(u => u.customerId === customerId)) {
    allCustomer.push({ customerId, socketId, userInfo });
  }
};
const addSeller = (sellerId, socketId, userInfo) => {
  if (!allSeller.some(u => u.sellerId === sellerId)) {
    allSeller.push({ sellerId, socketId, userInfo });
  }
};
const findCustomer = (customerId) => allCustomer.find(c => c.customerId === customerId);
const findSeller = (sellerId) => allSeller.find(c => c.sellerId === sellerId);
const removeUser = (socketId) => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId);
  allSeller = allSeller.filter(c => c.socketId !== socketId);
};

// אירועי Socket.io
io.on('connection', (soc) => {
  console.log('✅ Socket.io Connected');

  soc.on('add_user', (customerId, userInfo) => {
    addUser(customerId, soc.id, userInfo);
    io.emit('activeSeller', allSeller);
  });

  soc.on('add_seller', (sellerId, userInfo) => {
    addSeller(sellerId, soc.id, userInfo);
    io.emit('activeSeller', allSeller);
  });

  soc.on('send_seller_message', (msg) => {
    const customer = findCustomer(msg.receverId);
    if (customer) {
      soc.to(customer.socketId).emit('seller_message', msg);
    }
  });

  soc.on('send_customer_message', (msg) => {
    const seller = findSeller(msg.receverId);
    if (seller) {
      soc.to(seller.socketId).emit('customer_message', msg);
    }
  });

  soc.on('send_message_admin_to_seller', (msg) => {
    const seller = findSeller(msg.receverId);
    if (seller) {
      soc.to(seller.socketId).emit('receved_admin_message', msg);
    }
  });

  soc.on('send_message_seller_to_admin', (msg) => {
    if (admin.socketId) {
      soc.to(admin.socketId).emit('receved_seller_message', msg);
    }
  });

  soc.on('add_admin', (adminInfo) => {
    delete adminInfo.email;
    delete adminInfo.password;
    admin = { ...adminInfo, socketId: soc.id };
    io.emit('activeSeller', allSeller);
  });

  soc.on('disconnect', () => {
    console.log('❌ User disconnected');
    removeUser(soc.id);
    io.emit('activeSeller', allSeller);
  });
});


// ייבוא קבצי הנתיבים (routes)
import homeRoutes from './routes/home/homeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/order/orderRoutes.js';
import cardRoutes from './routes/home/cardRoutes.js';
import categoryRoutes from './routes/dashboard/categoryRoutes.js';
import productRoutes from './routes/dashboard/productRoutes.js';
import sellerRoutes from './routes/dashboard/sellerRoutes.js';
import customerAuthRoutes from './routes/home/customerAuthRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboard/dashboardRoutes.js';

// הגדרת הנתיבים ב־Express
app.use('/api/home', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', cardRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', sellerRoutes);
app.use('/api/customer', customerAuthRoutes);
app.use('/api', chatRoutes);
app.use('/api', paymentRoutes);
app.use('/api', dashboardRoutes);

// בדיקת שרת
app.get('/', (req, res) => res.send('Hello Server'));

// הפעלת מסד הנתונים והשרת
const port = process.env.PORT || 5001;
dbConnect();

server.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
