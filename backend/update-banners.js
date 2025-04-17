import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './models/bannerModel.js';
import Product from './models/productModel.js';

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
    
    // Get product IDs
    const products = await Product.find({}).limit(6);
    if (products.length === 0) {
      console.error('❌ No products found');
      process.exit(1);
    }
    
    // New banner images (high quality, full-width banner images)
    const bannerImages = [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ];
    
    // Create new banners
    const banners = [];
    for (let i = 0; i < Math.min(products.length, bannerImages.length); i++) {
      banners.push({
        productId: products[i]._id,
        banner: bannerImages[i],
        link: `/product/details/${products[i].slug}`
      });
    }
    
    const createdBanners = await Banner.insertMany(banners);
    console.log(`✅ Added ${createdBanners.length} banners`);
    
    // Log the created banners
    console.log('New banners:');
    console.log(JSON.stringify(createdBanners, null, 2));
    
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
