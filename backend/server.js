// Import של מודולים חיצוניים תוך שימוש בסגנון ESM
import express from 'express'; 
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { dbConnect } from './utiles/db.js'; 
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// אתחול משתני סביבה
dotenv.config();

// יצירת אפליקציית express
const app = express();

// יצירת שרת HTTP מבוסס express
const server = createServer(app);

// ✅ הגדרות CORS משופרות – כולל Socket.io
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// שימוש במידלוור CORS + טיפול בבקשות preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // שורת קוד קריטית לטיפול בבקשות OPTIONS

// שימוש במידלוור לניתוח JSON וטיפול בעוגיות (cookies)
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ הגדרת Socket.io עם אפשרויות CORS נכונות
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// משתנים לניהול חיבורי סוקט – לקוחות, מוכרים ומנהל
let allCustomer = [];
let allSeller = [];
let admin = {};

// פונקציה להוספת לקוח לרשימת הסוקט
const addUser = (customerId, socketId, userInfo) => {
  if (!allCustomer.some(u => u.customerId === customerId)) {
    allCustomer.push({ customerId, socketId, userInfo });
  }
};

// פונקציה להוספת מוכר לרשימת הסוקט
const addSeller = (sellerId, socketId, userInfo) => {
  if (!allSeller.some(u => u.sellerId === sellerId)) {
    allSeller.push({ sellerId, socketId, userInfo });
  }
};

// פונקציות למציאת לקוח/מוכר לפי מזהה הסוקט
const findCustomer = (customerId) => allCustomer.find(c => c.customerId === customerId);
const findSeller = (sellerId) => allSeller.find(c => c.sellerId === sellerId);

// פונקציה להסרת חיבור מהמערכת כאשר המשתמש מתנתק
const removeUser = (socketId) => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId);
  allSeller = allSeller.filter(c => c.socketId !== socketId);
};

// ✅ טיפול באירועי סוקט
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

  // העברת הודעות בין לקוחות למוכרים
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

  // העברת הודעות מהמנהל למוכר ולהיפך
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

  // הוספת מנהל – מחיקה של פרטי אימייל וסיסמה לשמירה על פרטיות
  soc.on('add_admin', (adminInfo) => {
    delete adminInfo.email;
    delete adminInfo.password;
    admin = { ...adminInfo, socketId: soc.id };
    io.emit('activeSeller', allSeller);
  });

  // טיפול בעת ניתוק משתמש
  soc.on('disconnect', () => {
    console.log('❌ User disconnected');
    removeUser(soc.id);
    io.emit('activeSeller', allSeller);
  });
});

// ✅ ייבוא קבצי הנתיבים (routes)
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

// ✅ הגדרת הנתיבים ב־Express
app.use('/api/home', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', cardRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', sellerRoutes);
app.use('/api', customerAuthRoutes);
app.use('/api', chatRoutes);
app.use('/api', paymentRoutes);
app.use('/api', dashboardRoutes);

// ✅ נתיב בדיקה ראשי
app.get('/', (req, res) => res.send('Hello Server'));

// ✅ קביעת הפורט – במשתנה סביבה או 5001 כברירת מחדל
const port = process.env.PORT || 5001;

// ✅ חיבור למסד הנתונים
dbConnect();

// ✅ הפעלת השרת
server.listen(port, () => console.log(`🚀 Server is running on port ${port}`));

/*
  הערה חשובה
  שים לב – אם ה-frontend או ה-dashboard שלך מתחברים ל-socket.io,
  יש לוודא שהלקוח משתמש בכתובת הנכונה (http://localhost:5001) ולא ב-5000.
  השגיאה שראית מצביעה על ניסיון חיבור לפורט 5000, ולכן עדכן את קוד הלקוח בהתאם.
*/
