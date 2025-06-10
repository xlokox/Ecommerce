import mongoose from 'mongoose';
import customerOrder from '../models/customerOrder.js';
import myShopWallet from '../models/myShopWallet.js';
import productModel from '../models/productModel.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const generateRandomOrders = async () => {
  try {
    console.log('🚀 Starting to generate test data...');

    // Get existing products
    const products = await productModel.find({}).limit(10);
    if (products.length === 0) {
      console.log('❌ No products found. Please add some products first.');
      return;
    }

    console.log(`📦 Found ${products.length} products to use for orders`);

    // Generate orders for the last 30 days
    const orders = [];
    const walletEntries = [];
    
    for (let i = 0; i < 100; i++) {
      // Random date within last 30 days
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
      
      // Random hour for today's orders (for hourly analytics)
      if (i < 20) {
        const today = new Date();
        today.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        randomDate.setTime(today.getTime());
      }

      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * 500) + 50;

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
        payment_status: Math.random() > 0.2 ? 'paid' : 'pending',
        shippingInfo: {
          name: `Customer ${i + 1}`,
          address: `${Math.floor(Math.random() * 9999)} Main St`,
          phone: `555-${Math.floor(Math.random() * 9000) + 1000}`,
          post: `${Math.floor(Math.random() * 90000) + 10000}`,
          province: 'State',
          city: 'City',
          area: 'Area'
        },
        delivery_status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        date: randomDate.toISOString().split('T')[0],
        createdAt: randomDate,
        updatedAt: randomDate
      };

      orders.push(order);

      // Add wallet entry for paid orders
      if (order.payment_status === 'paid') {
        walletEntries.push({
          amount: order.price,
          month: randomDate.getMonth() + 1,
          year: randomDate.getFullYear(),
          createdAt: randomDate
        });
      }
    }

    // Insert orders
    console.log('📝 Inserting orders...');
    await customerOrder.insertMany(orders);
    console.log(`✅ Inserted ${orders.length} orders`);

    // Insert wallet entries
    console.log('💰 Inserting wallet entries...');
    await myShopWallet.insertMany(walletEntries);
    console.log(`✅ Inserted ${walletEntries.length} wallet entries`);

    console.log('🎉 Test data generation completed!');
    
    // Show some stats
    const totalOrders = await customerOrder.countDocuments();
    const totalSales = await myShopWallet.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    console.log(`📊 Total orders in database: ${totalOrders}`);
    console.log(`💵 Total sales: $${totalSales[0]?.total || 0}`);

  } catch (error) {
    console.error('❌ Error generating test data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
generateRandomOrders();
