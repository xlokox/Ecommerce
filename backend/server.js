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

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Security middleware
app.use(securityMiddleware);

// CORS with secure configuration - Enhanced for Mobile App Support
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com']
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        // Allow all local network IPs for mobile development
        /^http:\/\/192\.168\.\d+\.\d+:19006$/, // Expo development
        /^http:\/\/10\.\d+\.\d+\.\d+:19006$/,  // Alternative network range
        /^http:\/\/172\.\d+\.\d+\.\d+:19006$/ // Docker network range
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'X-CSRF-Token',
    'Authorization',
    'X-Client-Type',
    'X-Platform',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200 // Support legacy browsers
}));

// Add logging middleware
app.use(loggingMiddleware);

// Enhanced test endpoint for mobile app connectivity
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is connected and working!',
    timestamp: new Date().toISOString(),
    server: 'E-commerce Backend',
    version: '1.0.0',
    clientType: req.headers['x-client-type'] || 'unknown',
    platform: req.headers['x-platform'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown'
  });
});

// Health check route for monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Public chat endpoint for getting available sellers
import ChatController from './controllers/chat/ChatController.js';
app.get('/api/chat/customer/get-available-sellers', ChatController.get_available_sellers);

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

// הגדרת Socket.io עם אפשרויות CORS - Enhanced for Mobile Support
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://your-domain.com']
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          // Allow mobile development
          /^http:\/\/192\.168\.\d+\.\d+:19006$/,
          /^http:\/\/10\.\d+\.\d+\.\d+:19006$/,
          /^http:\/\/172\.\d+\.\d+\.\d+:19006$/
        ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowEIO3: true // Support older clients
  },
  transports: ['websocket', 'polling'], // Support both transports for mobile
  pingTimeout: 60000,
  pingInterval: 25000
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

// 🚀 Enhanced Socket.io Events with Modern Chat Features
io.on('connection', (soc) => {
  console.log('✅ Socket.io Connected:', soc.id);

  soc.on('add_user', (customerId, userInfo) => {
    console.log('👤 Customer connected:', customerId);
    addUser(customerId, soc.id, userInfo);
    io.emit('activeSeller', allSeller);
    io.emit('activeCustomer', allCustomer);
  });

  soc.on('add_seller', (sellerId, userInfo) => {
    console.log('🏪 Seller connected:', sellerId);
    addSeller(sellerId, soc.id, userInfo);
    io.emit('activeSeller', allSeller);
    io.emit('activeCustomer', allCustomer);
  });

  // 📤 Enhanced Seller to Customer Message
  soc.on('send_seller_message', (msg) => {
    console.log('📤 Seller message:', msg);
    const customer = findCustomer(msg.receverId);
    if (customer) {
      soc.to(customer.socketId).emit('seller_message', {
        ...msg,
        timestamp: new Date().toISOString(),
        delivered: true
      });
      console.log('✅ Message delivered to customer:', customer.customerId);
    } else {
      console.log('❌ Customer not found:', msg.receverId);
    }
  });

  // 📤 Enhanced Customer to Seller Message
  soc.on('send_customer_message', (msg) => {
    console.log('📤 Customer message:', msg);
    const seller = findSeller(msg.receverId);
    if (seller) {
      soc.to(seller.socketId).emit('customer_message', {
        ...msg,
        timestamp: new Date().toISOString(),
        delivered: true
      });
      console.log('✅ Message delivered to seller:', seller.sellerId);
    } else {
      console.log('❌ Seller not found:', msg.receverId);
    }
  });

  // 🔤 Typing Indicator
  soc.on('typing', (data) => {
    console.log('⌨️ Typing indicator:', data);
    const { senderId, receiverId, typing } = data;

    // Find receiver (could be customer or seller)
    const customer = findCustomer(receiverId);
    const seller = findSeller(receiverId);

    if (customer) {
      soc.to(customer.socketId).emit('typing', {
        senderId,
        typing,
        timestamp: new Date().toISOString()
      });
    } else if (seller) {
      soc.to(seller.socketId).emit('typing', {
        senderId,
        typing,
        timestamp: new Date().toISOString()
      });
    }
  });

  // 📖 Message Read Status
  soc.on('message_read', (data) => {
    console.log('📖 Message read:', data);
    const { messageId, readBy, senderId } = data;

    const customer = findCustomer(senderId);
    const seller = findSeller(senderId);

    if (customer) {
      soc.to(customer.socketId).emit('message_read_confirmation', {
        messageId,
        readBy,
        timestamp: new Date().toISOString()
      });
    } else if (seller) {
      soc.to(seller.socketId).emit('message_read_confirmation', {
        messageId,
        readBy,
        timestamp: new Date().toISOString()
      });
    }
  });

  // 🔄 Admin Messages (existing functionality)
  soc.on('send_message_admin_to_seller', (msg) => {
    console.log('📤 Admin to seller message:', msg);
    const seller = findSeller(msg.receverId);
    if (seller) {
      soc.to(seller.socketId).emit('receved_admin_message', msg);
    }
  });

  soc.on('send_message_seller_to_admin', (msg) => {
    console.log('📤 Seller to admin message:', msg);
    if (admin.socketId) {
      soc.to(admin.socketId).emit('receved_seller_message', msg);
    }
  });

  soc.on('add_admin', (adminInfo) => {
    console.log('👑 Admin connected:', adminInfo.name);
    delete adminInfo.email;
    delete adminInfo.password;
    admin = { ...adminInfo, socketId: soc.id };
    io.emit('activeSeller', allSeller);
    io.emit('activeCustomer', allCustomer);
  });

  // 🔌 Enhanced Disconnect Handler
  soc.on('disconnect', () => {
    console.log('❌ User disconnected:', soc.id);
    removeUser(soc.id);
    io.emit('activeSeller', allSeller);
    io.emit('activeCustomer', allCustomer);
  });

  // 🏥 Connection Health Check
  soc.on('ping', () => {
    soc.emit('pong', { timestamp: new Date().toISOString() });
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
import syncProductsRoutes from './routes/syncProducts.js';

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
app.use('/api/sync', syncProductsRoutes);

// בדיקת שרת
app.get('/', (req, res) => res.send('Hello Server'));

// הפעלת מסד הנתונים והשרת
const port = process.env.PORT || 5001;
dbConnect();

server.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
