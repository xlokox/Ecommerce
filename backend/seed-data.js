import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/categoryModel.js';
import Product from './models/productModel.js';
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

// Sample categories
const categories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Toys', slug: 'toys', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=2928&auto=format&fit=crop&ixlib=rb-4.0.3' }
];

// EXACT SAME 40 PRODUCTS AS MOBILE APP - PERFECT SYNC
const products = [
  // ELECTRONICS CATEGORY (8 products) - EXACT MATCH WITH MOBILE APP
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    category: 'Electronics',
    brand: 'Apple',
    price: 999,
    stock: 50,
    discount: 5,
    description: 'Latest iPhone with titanium design and A17 Pro chip',
    shopName: 'Tech Store',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    category: 'Electronics',
    brand: 'Samsung',
    price: 899,
    stock: 45,
    discount: 8,
    description: 'Flagship Android phone with AI features',
    shopName: 'Tech Store',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    category: 'Electronics',
    brand: 'Apple',
    price: 1999,
    stock: 25,
    discount: 10,
    description: 'Professional laptop with M3 chip for creators',
    shopName: 'Tech Store',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    category: 'Electronics',
    brand: 'Dell',
    price: 1299,
    stock: 30,
    discount: 15,
    description: 'Ultrabook with Intel Core i7 and premium design',
    shopName: 'Tech Store',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    category: 'Electronics',
    brand: 'Sony',
    price: 399,
    stock: 60,
    discount: 12,
    description: 'Premium noise-canceling wireless headphones',
    shopName: 'Audio Pro',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    category: 'Electronics',
    brand: 'Apple',
    price: 429,
    stock: 40,
    discount: 7,
    description: 'Advanced smartwatch with health monitoring',
    shopName: 'Tech Store',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'iPad Air',
    slug: 'ipad-air',
    category: 'Electronics',
    brand: 'Apple',
    price: 599,
    stock: 35,
    discount: 6,
    description: 'Powerful tablet for work and creativity',
    shopName: 'Tech Store',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Gaming Console',
    slug: 'gaming-console',
    category: 'Electronics',
    brand: 'Sony',
    price: 499,
    stock: 20,
    discount: 0,
    description: 'Next-gen gaming console with 4K graphics',
    shopName: 'Gaming Zone',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },

  // CLOTHING CATEGORY (8 products) - EXACT MATCH WITH MOBILE APP
  {
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    category: 'Clothing',
    brand: 'Nike',
    price: 29.99,
    stock: 100,
    discount: 5,
    description: 'Comfortable cotton t-shirt for everyday wear',
    shopName: 'Fashion Hub',
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Elegant Summer Dress',
    slug: 'elegant-summer-dress',
    category: 'Clothing',
    brand: 'Zara',
    price: 79.99,
    stock: 80,
    discount: 15,
    description: 'Beautiful summer dress for special occasions',
    shopName: 'Fashion Hub',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    category: 'Clothing',
    brand: 'Adidas',
    price: 129.99,
    stock: 70,
    discount: 20,
    description: 'High-performance running shoes with boost technology',
    shopName: 'Sports World',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Denim Jeans',
    slug: 'denim-jeans',
    category: 'Clothing',
    brand: 'Levis',
    price: 89.99,
    stock: 90,
    discount: 10,
    description: 'Classic denim jeans with perfect fit',
    shopName: 'Fashion Hub',
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2926&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Winter Jacket',
    slug: 'winter-jacket',
    category: 'Clothing',
    brand: 'North Face',
    price: 199.99,
    stock: 40,
    discount: 25,
    description: 'Warm winter jacket for cold weather',
    shopName: 'Outdoor Gear',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Business Shirt',
    slug: 'business-shirt',
    category: 'Clothing',
    brand: 'Hugo Boss',
    price: 119.99,
    stock: 60,
    discount: 8,
    description: 'Professional business shirt for office wear',
    shopName: 'Business Attire',
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Sports Hoodie',
    slug: 'sports-hoodie',
    category: 'Clothing',
    brand: 'Under Armour',
    price: 69.99,
    stock: 85,
    discount: 12,
    description: 'Comfortable hoodie for sports and casual wear',
    shopName: 'Sports World',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Formal Shoes',
    slug: 'formal-shoes',
    category: 'Clothing',
    brand: 'Clarks',
    price: 149.99,
    stock: 50,
    discount: 18,
    description: 'Elegant formal shoes for business occasions',
    shopName: 'Shoe Store',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1582897085656-c636d006a246?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },

  // HOME & KITCHEN CATEGORY (8 products)
  {
    name: 'Smart Coffee Maker',
    slug: 'smart-coffee-maker',
    category: 'Home & Kitchen',
    brand: 'Breville',
    price: 299.99,
    stock: 35,
    discount: 18,
    description: 'WiFi-enabled coffee maker with app control',
    shopName: 'Home Essentials',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Air Fryer',
    slug: 'air-fryer',
    category: 'Home & Kitchen',
    brand: 'Ninja',
    price: 149.99,
    stock: 45,
    discount: 22,
    description: 'Healthy cooking with hot air circulation',
    shopName: 'Kitchen Pro',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1585515656643-1e4d1d6d8c8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Blender',
    slug: 'blender',
    category: 'Home & Kitchen',
    brand: 'Vitamix',
    price: 399.99,
    stock: 25,
    discount: 15,
    description: 'Professional-grade blender for smoothies and more',
    shopName: 'Kitchen Pro',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1585515656643-1e4d1d6d8c8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Non-Stick Pan Set',
    slug: 'non-stick-pan-set',
    category: 'Home & Kitchen',
    brand: 'Tefal',
    price: 89.99,
    stock: 60,
    discount: 12,
    description: 'Complete set of non-stick cooking pans',
    shopName: 'Kitchen Essentials',
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Microwave Oven',
    slug: 'microwave-oven',
    category: 'Home & Kitchen',
    brand: 'Panasonic',
    price: 199.99,
    stock: 30,
    discount: 10,
    description: 'Compact microwave with multiple cooking modes',
    shopName: 'Home Appliances',
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Knife Set',
    slug: 'knife-set',
    category: 'Home & Kitchen',
    brand: 'Wusthof',
    price: 249.99,
    stock: 40,
    discount: 20,
    description: 'Professional chef knife set with wooden block',
    shopName: 'Kitchen Pro',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Rice Cooker',
    slug: 'rice-cooker',
    category: 'Home & Kitchen',
    brand: 'Zojirushi',
    price: 179.99,
    stock: 35,
    discount: 8,
    description: 'Smart rice cooker with fuzzy logic technology',
    shopName: 'Kitchen Essentials',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Stand Mixer',
    slug: 'stand-mixer',
    category: 'Home & Kitchen',
    brand: 'KitchenAid',
    price: 349.99,
    stock: 20,
    discount: 25,
    description: 'Professional stand mixer for baking enthusiasts',
    shopName: 'Baking Supplies',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },

  // BOOKS CATEGORY (8 products)
  {
    name: 'The Great Novel',
    slug: 'the-great-novel',
    category: 'Books',
    brand: 'Penguin',
    price: 24.99,
    stock: 200,
    discount: 0,
    description: 'Bestselling fiction novel that captivates readers',
    shopName: 'Book World',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Business Strategy Guide',
    slug: 'business-strategy-guide',
    category: 'Books',
    brand: 'Harvard Business',
    price: 34.99,
    stock: 150,
    discount: 5,
    description: 'Comprehensive guide to modern business strategies',
    shopName: 'Book World',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Cooking Masterclass',
    slug: 'cooking-masterclass',
    category: 'Books',
    brand: 'Gordon Ramsay',
    price: 29.99,
    stock: 100,
    discount: 10,
    description: 'Learn professional cooking techniques from the master',
    shopName: 'Culinary Books',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Science Fiction Epic',
    slug: 'science-fiction-epic',
    category: 'Books',
    brand: 'Orbit Books',
    price: 19.99,
    stock: 180,
    discount: 8,
    description: 'Epic space adventure that spans galaxies',
    shopName: 'Sci-Fi Corner',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Self-Help Guide',
    slug: 'self-help-guide',
    category: 'Books',
    brand: 'Random House',
    price: 22.99,
    stock: 120,
    discount: 12,
    description: 'Transform your life with proven strategies',
    shopName: 'Personal Development',
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'History Chronicles',
    slug: 'history-chronicles',
    category: 'Books',
    brand: 'Oxford Press',
    price: 39.99,
    stock: 80,
    discount: 15,
    description: 'Comprehensive history of ancient civilizations',
    shopName: 'Academic Books',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Programming Fundamentals',
    slug: 'programming-fundamentals',
    category: 'Books',
    brand: 'Tech Publications',
    price: 49.99,
    stock: 90,
    discount: 20,
    description: 'Learn programming from basics to advanced concepts',
    shopName: 'Tech Books',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Art & Design Inspiration',
    slug: 'art-design-inspiration',
    category: 'Books',
    brand: 'Creative Press',
    price: 32.99,
    stock: 70,
    discount: 6,
    description: 'Beautiful collection of modern art and design',
    shopName: 'Art Books',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },

  // TOYS CATEGORY (8 products)
  {
    name: 'Remote Control Drone',
    slug: 'remote-control-drone',
    category: 'Toys',
    brand: 'DJI',
    price: 199.99,
    stock: 45,
    discount: 15,
    description: 'High-tech drone for outdoor adventures',
    shopName: 'Toy Land',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'LEGO Architecture Set',
    slug: 'lego-architecture-set',
    category: 'Toys',
    brand: 'LEGO',
    price: 89.99,
    stock: 60,
    discount: 10,
    description: 'Build famous landmarks with detailed LEGO sets',
    shopName: 'Building Blocks',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Board Game Collection',
    slug: 'board-game-collection',
    category: 'Toys',
    brand: 'Hasbro',
    price: 49.99,
    stock: 85,
    discount: 12,
    description: 'Classic board games for family entertainment',
    shopName: 'Game Central',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Action Figure Set',
    slug: 'action-figure-set',
    category: 'Toys',
    brand: 'Marvel',
    price: 34.99,
    stock: 100,
    discount: 8,
    description: 'Collectible superhero action figures',
    shopName: 'Hero Toys',
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Educational Puzzle',
    slug: 'educational-puzzle',
    category: 'Toys',
    brand: 'Ravensburger',
    price: 24.99,
    stock: 120,
    discount: 5,
    description: 'Educational jigsaw puzzle for learning and fun',
    shopName: 'Learning Toys',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'RC Racing Car',
    slug: 'rc-racing-car',
    category: 'Toys',
    brand: 'Hot Wheels',
    price: 79.99,
    stock: 55,
    discount: 18,
    description: 'High-speed remote control racing car',
    shopName: 'Speed Toys',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Dollhouse Playset',
    slug: 'dollhouse-playset',
    category: 'Toys',
    brand: 'Barbie',
    price: 129.99,
    stock: 40,
    discount: 22,
    description: 'Complete dollhouse with furniture and accessories',
    shopName: 'Doll World',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Science Experiment Kit',
    slug: 'science-experiment-kit',
    category: 'Toys',
    brand: 'National Geographic',
    price: 59.99,
    stock: 70,
    discount: 14,
    description: 'Hands-on science experiments for curious minds',
    shopName: 'STEM Toys',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  }
];

// We'll create banners after products are created since they need product IDs

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});

    console.log('✅ Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Added ${createdCategories.length} categories`);

    // Insert products
    const productPromises = products.map(async (product) => {
      const category = await Category.findOne({ name: product.category });
      if (category) {
        return {
          ...product,
          category: category._id
        };
      }
    });

    const productsWithCategoryIds = await Promise.all(productPromises);
    const createdProducts = await Product.insertMany(productsWithCategoryIds.filter(p => p));
    console.log(`✅ Added ${createdProducts.length} products`);

    // Create banners with product IDs
    const banners = [
      {
        productId: createdProducts[0]._id,
        banner: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        link: `/product/details/${createdProducts[0].slug}`
      },
      {
        productId: createdProducts[1]._id,
        banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        link: `/product/details/${createdProducts[1].slug}`
      },
      {
        productId: createdProducts[2]._id,
        banner: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        link: `/product/details/${createdProducts[2].slug}`
      }
    ];

    // Insert banners
    const createdBanners = await Banner.insertMany(banners);
    console.log(`✅ Added ${createdBanners.length} banners`);

    console.log('✅ Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeding process
connectDB().then(() => {
  seedData();
});
