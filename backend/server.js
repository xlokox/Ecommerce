// backend/server.js

// 1️⃣ Load environment variables from backend/.env
import dotenv from 'dotenv';
dotenv.config();  // automatically reads backend/.env

// 2️⃣ Standard imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { dbConnect } from './utiles/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cloudinary from 'cloudinary';

// 3️⃣ Verify that critical env vars are loaded
console.log('DB_URL:    ', process.env.DB_URL);
console.log('SECRET:    ', process.env.SECRET);
console.log('cloud_name:', process.env.cloud_name);
console.log('api_key:   ', process.env.api_key);
console.log('api_secret:', process.env.api_secret);

// 4️⃣ Configure Cloudinary once
cloudinary.v2.config({
  cloud_name:  process.env.cloud_name,
  api_key:     process.env.api_key,
  api_secret:  process.env.api_secret,
  secure:      true,
});

// 5️⃣ Create Express app and HTTP server
const app = express();
const server = createServer(app);

// 6️⃣ CORS settings
const allowedOrigins = ['http://localhost:3000','http://localhost:3001'];
app.use(cors({
  origin:        allowedOrigins,
  methods:       ['GET','POST','PUT','DELETE'],
  credentials:   true,
  allowedHeaders:['Content-Type','Authorization'],
}));
app.options('*', cors());

// 7️⃣ JSON & cookie parsing
app.use(bodyParser.json());
app.use(cookieParser());

// 8️⃣ Socket.io setup
const io = new Server(server, {
  cors: {
    origin:      allowedOrigins,
    methods:     ['GET','POST'],
    credentials: true,
  }
});

// 9️⃣ Socket.io event handlers
let allCustomer = [];
let allSeller   = [];
let admin       = {};

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
const findSeller   = (sellerId)   => allSeller.find(s => s.sellerId === sellerId);
const removeUser   = (socketId)    => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId);
  allSeller   = allSeller.filter(s => s.socketId !== socketId);
};

io.on('connection', (socket) => {
  console.log('✅ Socket.io Connected');

  socket.on('add_user', (customerId, userInfo) => {
    addUser(customerId, socket.id, userInfo);
    io.emit('activeSeller', allSeller);
  });

  socket.on('add_seller', (sellerId, userInfo) => {
    addSeller(sellerId, socket.id, userInfo);
    io.emit('activeSeller', allSeller);
  });

  socket.on('send_seller_message', (msg) => {
    const cust = findCustomer(msg.receverId);
    if (cust) socket.to(cust.socketId).emit('seller_message', msg);
  });

  socket.on('send_customer_message', (msg) => {
    const sel = findSeller(msg.receverId);
    if (sel) socket.to(sel.socketId).emit('customer_message', msg);
  });

  socket.on('send_message_admin_to_seller', (msg) => {
    const sel = findSeller(msg.receverId);
    if (sel) socket.to(sel.socketId).emit('receved_admin_message', msg);
  });

  socket.on('send_message_seller_to_admin', (msg) => {
    if (admin.socketId) socket.to(admin.socketId).emit('receved_seller_message', msg);
  });

  socket.on('add_admin', (adminInfo) => {
    delete adminInfo.email;
    delete adminInfo.password;
    admin = { ...adminInfo, socketId: socket.id };
    io.emit('activeSeller', allSeller);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
    removeUser(socket.id);
    io.emit('activeSeller', allSeller);
  });
});

// 10️⃣ Import middleware & routes
import { authMiddleware }      from './middlewares/authMiddleware.js';
import homeRoutes              from './routes/home/homeRoutes.js';
import cardRoutes              from './routes/home/cardRoutes.js';
import customerAuthRoutes      from './routes/home/customerAuthRoutes.js';
import authRoutes              from './routes/authRoutes.js';
import orderRoutes             from './routes/order/orderRoutes.js';
import categoryRoutes          from './routes/dashboard/categoryRoutes.js';
import productRoutes           from './routes/dashboard/productRoutes.js';
import sellerRoutes            from './routes/dashboard/sellerRoutes.js';
import chatRoutes              from './routes/chatRoutes.js';
import paymentRoutes           from './routes/paymentRoutes.js';
import dashboardRoutes         from './routes/dashboard/dashboardRoutes.js';

// 11️⃣ Mount routes
app.use('/api/home',         homeRoutes);
app.use('/api/home/product', authMiddleware, cardRoutes);
app.use('/api/customer',     customerAuthRoutes);
app.use('/api',              authRoutes);
app.use('/api',              orderRoutes);
app.use('/api',              categoryRoutes);
app.use('/api',              productRoutes);
app.use('/api',              sellerRoutes);
app.use('/api',              chatRoutes);
app.use('/api',              paymentRoutes);
app.use('/api',              dashboardRoutes);

// 12️⃣ Health check
app.get('/', (_req, res) => res.send('Hello Server'));

// 13️⃣ Connect to DB & start server
dbConnect();
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
