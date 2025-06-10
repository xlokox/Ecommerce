import mongoose from 'mongoose';
import customerOrder from '../models/customerOrder.js';
import myShopWallet from '../models/myShopWallet.js';
import productModel from '../models/productModel.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const addRealtimeOrder = async () => {
  try {
    // Get existing products
    const products = await productModel.find({}).limit(10);
    if (products.length === 0) {
      console.log('❌ No products found.');
      return;
    }

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const price = Math.floor(Math.random() * 500) + 50;
    const now = new Date();

    const order = {
      customerId: new mongoose.Types.ObjectId(),
      products: [{
        productId: randomProduct._id,
        name: randomProduct.name,
        price: price,
        quantity: quantity,
        images: randomProduct.images
      }],
      price: price * quantity,
      payment_status: 'paid',
      shippingInfo: {
        name: `Live Customer ${Math.floor(Math.random() * 1000)}`,
        address: `${Math.floor(Math.random() * 9999)} Live St`,
        phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
        post: `${Math.floor(Math.random() * 90000) + 10000}`,
        province: 'State',
        city: 'City',
        area: 'Area'
      },
      delivery_status: 'pending',
      date: now.toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now
    };

    // Insert order
    await customerOrder.create(order);
    
    // Add wallet entry
    await myShopWallet.create({
      amount: order.price,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      createdAt: now
    });

    console.log(`✅ Added new order: $${order.price} for ${randomProduct.name}`);
    
  } catch (error) {
    console.error('❌ Error adding order:', error);
  }
};

// Add orders every 15 seconds
console.log('🚀 Starting real-time order simulation...');
console.log('📊 Adding new orders every 15 seconds. Press Ctrl+C to stop.');

setInterval(addRealtimeOrder, 15000);

// Add first order immediately
addRealtimeOrder();
