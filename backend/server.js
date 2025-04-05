/**
 * Main server file for the E-commerce application
 * This file sets up the Express server, Socket.io, and connects to the database
 */

// Import required packages
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cloudinary from 'cloudinary';

// Import routes
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

// Import database connection
import { dbConnect } from './utiles/db.js';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply middleware
app.use(helmet()); // Add security headers
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Configure Socket.io with CORS options and improved settings
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: false,
  allowEIO3: true,
});

// Variables to manage socket connections - customers, sellers and admin
let allCustomer = [];
let allSeller = [];
let admin = {};

/**
 * Helper functions for socket management
 */
// Add a customer to the active customers list
const addUser = (customerId, socketId, userInfo) => {
  if (!customerId) return;
  if (!allCustomer.some(u => u.customerId === customerId)) {
    allCustomer.push({ customerId, socketId, userInfo });
  }
};

// Add a seller to the active sellers list
const addSeller = (sellerId, socketId, userInfo) => {
  if (!sellerId) return;
  if (!allSeller.some(u => u.sellerId === sellerId)) {
    allSeller.push({ sellerId, socketId, userInfo });
  }
};

// Find a customer by ID
const findCustomer = (customerId) => allCustomer.find(c => c.customerId === customerId);

// Find a seller by ID
const findSeller = (sellerId) => allSeller.find(c => c.sellerId === sellerId);

// Remove a user when they disconnect
const removeUser = (socketId) => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId);
  allSeller = allSeller.filter(c => c.socketId !== socketId);
};

// Socket.io event handlers
io.on('connection', (soc) => {
  console.log('✅ Socket.io Connected');

  // Handle customer connection
  soc.on('add_user', (customerId, userInfo) => {
    try {
      addUser(customerId, soc.id, userInfo);
      io.emit('activeSeller', allSeller);
    } catch (error) {
      console.error('Error in add_user event:', error);
    }
  });

  // Handle seller connection
  soc.on('add_seller', (sellerId, userInfo) => {
    try {
      addSeller(sellerId, soc.id, userInfo);
      io.emit('activeSeller', allSeller);
    } catch (error) {
      console.error('Error in add_seller event:', error);
    }
  });

  // Handle seller sending message to customer
  soc.on('send_seller_message', (msg) => {
    try {
      if (!msg || !msg.receverId) return;
      const customer = findCustomer(msg.receverId);
      if (customer) {
        soc.to(customer.socketId).emit('seller_message', msg);
      }
    } catch (error) {
      console.error('Error in send_seller_message event:', error);
    }
  });

  // Handle customer sending message to seller
  soc.on('send_customer_message', (msg) => {
    try {
      if (!msg || !msg.receverId) return;
      const seller = findSeller(msg.receverId);
      if (seller) {
        soc.to(seller.socketId).emit('customer_message', msg);
      }
    } catch (error) {
      console.error('Error in send_customer_message event:', error);
    }
  });

  // Handle admin sending message to seller
  soc.on('send_message_admin_to_seller', (msg) => {
    try {
      if (!msg || !msg.receverId) return;
      const seller = findSeller(msg.receverId);
      if (seller) {
        soc.to(seller.socketId).emit('receved_admin_message', msg);
      }
    } catch (error) {
      console.error('Error in send_message_admin_to_seller event:', error);
    }
  });

  // Handle seller sending message to admin
  soc.on('send_message_seller_to_admin', (msg) => {
    try {
      if (!admin.socketId) return;
      soc.to(admin.socketId).emit('receved_seller_message', msg);
    } catch (error) {
      console.error('Error in send_message_seller_to_admin event:', error);
    }
  });

  // Handle admin connection
  soc.on('add_admin', (adminInfo) => {
    try {
      if (!adminInfo) return;
      // Remove sensitive information
      delete adminInfo.email;
      delete adminInfo.password;
      admin = { ...adminInfo, socketId: soc.id };
      io.emit('activeSeller', allSeller);
    } catch (error) {
      console.error('Error in add_admin event:', error);
    }
  });

  // Handle disconnection
  soc.on('disconnect', () => {
    try {
      console.log('❌ User disconnected');
      removeUser(soc.id);
      io.emit('activeSeller', allSeller);
    } catch (error) {
      console.error('Error in disconnect event:', error);
    }
  });

  // Handle errors
  soc.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Set up API routes
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

// Root route for server health check
app.get('/', (_req, res) => res.send('Server is running'));

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const port = process.env.PORT || 5001;

// Connect to database and start server
dbConnect()
  .then(() => {
    server.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
