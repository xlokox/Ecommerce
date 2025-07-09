import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import Banner from '../models/bannerModel.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('🔗 Connecting to MongoDB at:', uri);

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

// ALL CATEGORIES - COMPLETE LIST FROM MOBILE APP
const categories = [
  // Basic Categories
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Toys', slug: 'toys', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=2928&auto=format&fit=crop&ixlib=rb-4.0.3' },
  
  // Extended Categories
  { name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Wearables', slug: 'wearables', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: "Men's Fashion", slug: 'mens-fashion', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: "Women's Fashion", slug: 'womens-fashion', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Kitchen Appliances', slug: 'kitchen-appliances', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Home Decor', slug: 'home-decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Fiction', slug: 'fiction', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Non-Fiction', slug: 'non-fiction', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: "Children's Books", slug: 'childrens-books', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Board Games', slug: 'board-games', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Outdoor Toys', slug: 'outdoor-toys', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Health', slug: 'health', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Outdoor Gear', slug: 'outdoor-gear', image: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Automotive', slug: 'automotive', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Pet Supplies', slug: 'pet-supplies', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Gaming', slug: 'gaming', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' },
  { name: 'Office Supplies', slug: 'office-supplies', image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3' }
];

// ALL PRODUCTS - COMPREHENSIVE CATALOG (50+ PRODUCTS)
const products = [
  // Smartphones (5 products)
  {
    name: 'iPhone 15 Pro', slug: 'iphone-15-pro', category: 'Smartphones', brand: 'Apple', price: 999, stock: 50, discount: 5,
    description: 'Latest iPhone with titanium design and A17 Pro chip', shopName: 'Tech Store', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Samsung Galaxy S24', slug: 'samsung-galaxy-s24', category: 'Smartphones', brand: 'Samsung', price: 899, stock: 45, discount: 8,
    description: 'Flagship Android phone with AI features', shopName: 'Tech Store', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', category: 'Smartphones', brand: 'Google', price: 799, stock: 40, discount: 10,
    description: 'Pure Android experience with advanced camera AI', shopName: 'Tech Store', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'OnePlus 12', slug: 'oneplus-12', category: 'Smartphones', brand: 'OnePlus', price: 699, stock: 35, discount: 12,
    description: 'Fast charging flagship with premium performance', shopName: 'Tech Store', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Xiaomi 14 Ultra', slug: 'xiaomi-14-ultra', category: 'Smartphones', brand: 'Xiaomi', price: 599, stock: 60, discount: 15,
    description: 'Photography-focused smartphone with Leica cameras', shopName: 'Tech Store', rating: 4.4,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Laptops (5 products)
  {
    name: 'MacBook Pro M3', slug: 'macbook-pro-m3', category: 'Laptops', brand: 'Apple', price: 1999, stock: 25, discount: 10,
    description: 'Professional laptop with M3 chip for creators', shopName: 'Tech Store', rating: 4.9,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Dell XPS 13', slug: 'dell-xps-13', category: 'Laptops', brand: 'Dell', price: 1299, stock: 30, discount: 15,
    description: 'Ultrabook with Intel Core i7 and premium design', shopName: 'Tech Store', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'HP Spectre x360', slug: 'hp-spectre-x360', category: 'Laptops', brand: 'HP', price: 1199, stock: 28, discount: 12,
    description: '2-in-1 convertible laptop with OLED display', shopName: 'Tech Store', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Lenovo ThinkPad X1', slug: 'lenovo-thinkpad-x1', category: 'Laptops', brand: 'Lenovo', price: 1399, stock: 22, discount: 8,
    description: 'Business laptop with legendary keyboard and durability', shopName: 'Tech Store', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'ASUS ROG Zephyrus', slug: 'asus-rog-zephyrus', category: 'Laptops', brand: 'ASUS', price: 1799, stock: 20, discount: 18,
    description: 'Gaming laptop with RTX 4080 and high refresh display', shopName: 'Gaming Pro', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Audio (4 products)
  {
    name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', category: 'Audio', brand: 'Sony', price: 399, stock: 60, discount: 12,
    description: 'Premium noise-canceling wireless headphones', shopName: 'Audio Pro', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'AirPods Pro 2', slug: 'airpods-pro-2', category: 'Audio', brand: 'Apple', price: 249, stock: 80, discount: 8,
    description: 'Wireless earbuds with adaptive transparency', shopName: 'Tech Store', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Bose QuietComfort', slug: 'bose-quietcomfort', category: 'Audio', brand: 'Bose', price: 329, stock: 45, discount: 15,
    description: 'World-class noise cancellation headphones', shopName: 'Audio Pro', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Marshall Acton III', slug: 'marshall-acton-iii', category: 'Audio', brand: 'Marshall', price: 279, stock: 35, discount: 10,
    description: 'Iconic Bluetooth speaker with classic rock aesthetics', shopName: 'Audio Pro', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Wearables (3 products)
  {
    name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', category: 'Wearables', brand: 'Apple', price: 429, stock: 40, discount: 7,
    description: 'Advanced smartwatch with health monitoring', shopName: 'Tech Store', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6', category: 'Wearables', brand: 'Samsung', price: 329, stock: 35, discount: 12,
    description: 'Android smartwatch with comprehensive health tracking', shopName: 'Tech Store', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Fitbit Sense 2', slug: 'fitbit-sense-2', category: 'Wearables', brand: 'Fitbit', price: 249, stock: 50, discount: 15,
    description: 'Health-focused smartwatch with stress management', shopName: 'Health Plus', rating: 4.4,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2872&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Men's Fashion (4 products)
  {
    name: 'Premium Cotton T-Shirt', slug: 'premium-cotton-tshirt', category: "Men's Fashion", brand: 'Nike', price: 29.99, stock: 100, discount: 5,
    description: 'Comfortable cotton t-shirt for everyday wear', shopName: 'Fashion Hub', rating: 4.2,
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Casual Denim Jeans', slug: 'casual-denim-jeans', category: "Men's Fashion", brand: 'Levis', price: 79.99, stock: 80, discount: 10,
    description: 'Classic fit denim jeans for casual wear', shopName: 'Fashion Hub', rating: 4.3,
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Business Dress Shirt', slug: 'business-dress-shirt', category: "Men's Fashion", brand: 'Hugo Boss', price: 89.99, stock: 60, discount: 8,
    description: 'Professional dress shirt for business occasions', shopName: 'Fashion Hub', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Winter Jacket', slug: 'winter-jacket', category: "Men's Fashion", brand: 'North Face', price: 199.99, stock: 40, discount: 20,
    description: 'Warm winter jacket for cold weather', shopName: 'Fashion Hub', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Women's Fashion (4 products)
  {
    name: 'Elegant Summer Dress', slug: 'elegant-summer-dress', category: "Women's Fashion", brand: 'Zara', price: 79.99, stock: 80, discount: 15,
    description: 'Beautiful summer dress for special occasions', shopName: 'Fashion Hub', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Designer Handbag', slug: 'designer-handbag', category: "Women's Fashion", brand: 'Michael Kors', price: 149.99, stock: 45, discount: 12,
    description: 'Stylish handbag for everyday elegance', shopName: 'Fashion Hub', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Silk Blouse', slug: 'silk-blouse', category: "Women's Fashion", brand: 'H&M', price: 59.99, stock: 70, discount: 8,
    description: 'Luxurious silk blouse for professional wear', shopName: 'Fashion Hub', rating: 4.4,
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Evening Gown', slug: 'evening-gown', category: "Women's Fashion", brand: 'Versace', price: 299.99, stock: 25, discount: 18,
    description: 'Stunning evening gown for formal events', shopName: 'Fashion Hub', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Footwear (3 products)
  {
    name: 'Running Sneakers', slug: 'running-sneakers', category: 'Footwear', brand: 'Adidas', price: 129.99, stock: 70, discount: 20,
    description: 'High-performance running shoes with boost technology', shopName: 'Sports World', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Leather Dress Shoes', slug: 'leather-dress-shoes', category: 'Footwear', brand: 'Cole Haan', price: 179.99, stock: 50, discount: 15,
    description: 'Premium leather shoes for formal occasions', shopName: 'Fashion Hub', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Casual Sneakers', slug: 'casual-sneakers', category: 'Footwear', brand: 'Converse', price: 69.99, stock: 90, discount: 10,
    description: 'Classic casual sneakers for everyday wear', shopName: 'Fashion Hub', rating: 4.3,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Kitchen Appliances (3 products)
  {
    name: 'Smart Coffee Maker', slug: 'smart-coffee-maker', category: 'Kitchen Appliances', brand: 'Breville', price: 299.99, stock: 35, discount: 18,
    description: 'WiFi-enabled coffee maker with app control', shopName: 'Home Essentials', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Air Fryer Pro', slug: 'air-fryer-pro', category: 'Kitchen Appliances', brand: 'Ninja', price: 149.99, stock: 60, discount: 15,
    description: 'Large capacity air fryer for healthy cooking', shopName: 'Home Essentials', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Stand Mixer', slug: 'stand-mixer', category: 'Kitchen Appliances', brand: 'KitchenAid', price: 379.99, stock: 25, discount: 12,
    description: 'Professional stand mixer for baking enthusiasts', shopName: 'Home Essentials', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Toys & Pet Supplies (5 products)
  {
    name: 'Dog Chew Toy Set', slug: 'dog-chew-toy-set', category: 'Toys', brand: 'PetSafe', price: 19.99, stock: 90, discount: 10,
    description: 'Durable chew toys for dogs of all sizes', shopName: 'Pet Paradise', rating: 4.4,
    images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=2928&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Interactive Cat Toy', slug: 'interactive-cat-toy', category: 'Pet Supplies', brand: 'Feliway', price: 24.99, stock: 75, discount: 8,
    description: 'Motion-activated toy to keep cats entertained', shopName: 'Pet Paradise', rating: 4.3,
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Remote Control Drone', slug: 'remote-control-drone', category: 'Outdoor Toys', brand: 'DJI', price: 199.99, stock: 45, discount: 15,
    description: 'High-tech drone for outdoor adventures', shopName: 'Toy Land', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Strategy Board Game', slug: 'strategy-board-game', category: 'Board Games', brand: 'Hasbro', price: 49.99, stock: 85, discount: 12,
    description: 'Engaging strategy game for family fun', shopName: 'Toy Land', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Gaming Console', slug: 'gaming-console', category: 'Gaming', brand: 'Sony', price: 499.99, stock: 30, discount: 5,
    description: 'Latest PlayStation console for immersive gaming', shopName: 'Gaming Pro', rating: 4.9,
    images: ['https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Books (4 products)
  {
    name: 'The Great Novel', slug: 'the-great-novel', category: 'Fiction', brand: 'Penguin', price: 24.99, stock: 200, discount: 0,
    description: 'Bestselling fiction novel that captivates readers', shopName: 'Book World', rating: 4.9,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Business Strategy Guide', slug: 'business-strategy-guide', category: 'Non-Fiction', brand: 'Harvard Business', price: 34.99, stock: 150, discount: 5,
    description: 'Comprehensive guide to modern business strategies', shopName: 'Book World', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Adventure Stories for Kids', slug: 'adventure-stories-kids', category: "Children's Books", brand: 'Scholastic', price: 16.99, stock: 120, discount: 8,
    description: 'Exciting adventure stories that kids will love', shopName: 'Book World', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Science Encyclopedia', slug: 'science-encyclopedia', category: "Children's Books", brand: 'National Geographic', price: 29.99, stock: 80, discount: 10,
    description: 'Educational encyclopedia for curious young minds', shopName: 'Book World', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Health & Beauty (4 products)
  {
    name: 'Skincare Set', slug: 'skincare-set', category: 'Beauty', brand: 'Clinique', price: 89.99, stock: 65, discount: 20,
    description: 'Complete skincare routine for healthy skin', shopName: 'Beauty Store', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Vitamin Supplements', slug: 'vitamin-supplements', category: 'Health', brand: 'Nature Made', price: 24.99, stock: 100, discount: 5,
    description: 'Essential vitamins for daily health support', shopName: 'Health Plus', rating: 4.3,
    images: ['https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Makeup Palette', slug: 'makeup-palette', category: 'Beauty', brand: 'Urban Decay', price: 54.99, stock: 85, discount: 15,
    description: 'Professional makeup palette with vibrant colors', shopName: 'Beauty Store', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Protein Powder', slug: 'protein-powder', category: 'Health', brand: 'Optimum Nutrition', price: 39.99, stock: 120, discount: 12,
    description: 'High-quality whey protein for fitness enthusiasts', shopName: 'Health Plus', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Sports & Outdoor (4 products)
  {
    name: 'Yoga Mat Pro', slug: 'yoga-mat-pro', category: 'Sports', brand: 'Lululemon', price: 79.99, stock: 75, discount: 15,
    description: 'Premium yoga mat for professional practice', shopName: 'Sports World', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Camping Backpack', slug: 'camping-backpack', category: 'Outdoor Gear', brand: 'North Face', price: 149.99, stock: 40, discount: 18,
    description: 'Durable backpack for hiking and camping', shopName: 'Adventure Gear', rating: 4.6,
    images: ['https://images.unsplash.com/photo-1445307806294-bff7f67ff225?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Tennis Racket', slug: 'tennis-racket', category: 'Sports', brand: 'Wilson', price: 129.99, stock: 55, discount: 10,
    description: 'Professional tennis racket for competitive play', shopName: 'Sports World', rating: 4.7,
    images: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Hiking Boots', slug: 'hiking-boots', category: 'Outdoor Gear', brand: 'Merrell', price: 159.99, stock: 45, discount: 20,
    description: 'Waterproof hiking boots for outdoor adventures', shopName: 'Adventure Gear', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1445307806294-bff7f67ff225?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3']
  },

  // Automotive & Office (3 products)
  {
    name: 'Car Phone Mount', slug: 'car-phone-mount', category: 'Automotive', brand: 'iOttie', price: 34.99, stock: 80, discount: 12,
    description: 'Secure phone mount for safe driving', shopName: 'Auto Parts', rating: 4.5,
    images: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Wireless Mouse', slug: 'wireless-mouse', category: 'Office Supplies', brand: 'Logitech', price: 29.99, stock: 100, discount: 8,
    description: 'Ergonomic wireless mouse for productivity', shopName: 'Office Pro', rating: 4.4,
    images: ['https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  },
  {
    name: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair', category: 'Furniture', brand: 'Herman Miller', price: 599.99, stock: 20, discount: 25,
    description: 'Professional office chair with lumbar support', shopName: 'Office Pro', rating: 4.8,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3']
  }
];

// SYNC FUNCTION
const fullSyncData = async () => {
  try {
    console.log('🚀 Starting full synchronization...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert all categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Added ${createdCategories.length} categories`);

    // Create category map for product insertion
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Insert all products with correct category references
    const productsWithCategoryIds = products.map(product => ({
      ...product,
      category: categoryMap[product.category] || product.category
    }));

    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`✅ Added ${createdProducts.length} products`);

    // Create banners from first 6 products
    const banners = createdProducts.slice(0, 6).map((product, index) => ({
      productId: product._id,
      banner: `http://localhost:3000/images/banner/${index + 1}.jpg`,
      link: `/product/details/${product.slug}`
    }));

    const createdBanners = await Banner.insertMany(banners);
    console.log(`✅ Added ${createdBanners.length} banners`);

    console.log('🎉 Full synchronization completed successfully!');
    console.log(`📊 Summary: ${createdCategories.length} categories, ${createdProducts.length} products, ${createdBanners.length} banners`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Synchronization error:', error.message);
    process.exit(1);
  }
};

// Run the synchronization
connectDB().then(() => {
  fullSyncData();
});
