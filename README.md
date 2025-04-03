# E-commerce Platform

A full-stack e-commerce application with customer, seller, and admin interfaces.

## 🚀 Features

- **Multi-user System**: Customers, Sellers, and Admin roles
- **Product Management**: Add, edit, and manage products
- **Order Processing**: Complete order lifecycle management
- **Real-time Chat**: Communication between customers, sellers, and admin
- **Payment Integration**: Secure payment processing
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io (for real-time communication)
- JWT Authentication
- Cloudinary (for image storage)

### Frontend
- React.js
- Redux (for state management)
- Socket.io-client
- Axios
- CSS/SCSS

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Ecommerce/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
# Server Configuration
PORT=5001
NODE_ENV=development
BYPASS_AUTH=true

# Database Configuration
DB_URL=mongodb://127.0.0.1:27017/ec

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Ecommerce/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

### Dashboard Setup

1. Navigate to the dashboard directory:
```bash
cd Ecommerce/dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the dashboard development server:
```bash
npm start
```

## 📱 Application Structure

### Backend Structure
- `controllers/`: Business logic
- `models/`: MongoDB schemas
- `routes/`: API endpoints
- `middlewares/`: Custom middleware functions
- `utiles/`: Helper functions and utilities
- `server.js`: Main entry point

### Frontend Structure
- `src/components/`: Reusable UI components
- `src/pages/`: Page components
- `src/store/`: Redux store configuration
- `src/api/`: API service functions
- `src/utils/`: Helper functions

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in:
- HTTP-only cookies for enhanced security
- Local storage for client-side access when needed

## 🌐 API Endpoints

### Authentication
- `POST /api/admin-login`: Admin login
- `POST /api/customer/login`: Customer login
- `POST /api/customer/register`: Customer registration
- `GET /api/customer/logout`: Logout

### Products
- `GET /api/home/get-products`: Get all products
- `GET /api/home/product-details/:slug`: Get product details
- `POST /api/product-add`: Add a new product (seller/admin)
- `POST /api/product-update`: Update a product (seller/admin)

### Orders
- `POST /api/home/order/place-order`: Place a new order
- `GET /api/home/customer/get-orders/:customerId/:status`: Get customer orders
- `GET /api/admin/orders`: Get all orders (admin)
- `PUT /api/admin/order-status/update/:orderId`: Update order status (admin)

## 🔄 Real-time Features

The application uses Socket.io for real-time features:
- Chat between customers and sellers
- Chat between sellers and admin
- Order status updates
- Notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or suggestions, please reach out to the project maintainers.
