import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './models/bannerModel.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to MongoDB at:', uri);
    
    await mongoose.connect(uri, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

// Update banners
const updateBanners = async () => {
  try {
    // Clear existing banners
    await Banner.deleteMany({});
    console.log('✅ Cleared existing banners');
    
    // New banners with hardcoded product IDs
    const banners = [
      {
        productId: "68013d6451f652820dc3187c", // Smartphone
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        link: '/product/details/smartphone'
      },
      {
        productId: "68013d6451f652820dc3187d", // Laptop
        banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        link: '/product/details/laptop'
      },
      {
        productId: "68013d6451f652820dc3187e", // T-Shirt
        banner: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        link: '/product/details/t-shirt'
      }
    ];
    
    const createdBanners = await Banner.insertMany(banners);
    console.log(`✅ Added ${createdBanners.length} banners`);
    
    console.log('✅ Banners updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating banners:', error);
    process.exit(1);
  }
};

// Run the update process
connectDB().then(() => {
  updateBanners();
});
