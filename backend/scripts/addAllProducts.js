import mongoose from 'mongoose';
import categoryModel from '../models/categoryModel.js';
import productModel from '../models/productModel.js';

// Connect to MongoDB
const dbConnect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('✅ Database connected successfully');
    
    // Clear existing products
    await productModel.deleteMany({});
    console.log('✅ Cleared existing products');

    // Get all categories
    const categories = await categoryModel.find({});
    console.log(`Found ${categories.length} categories`);

    // COMPREHENSIVE PRODUCTS FOR ALL CATEGORIES
    const products = [
      // ELECTRONICS CATEGORY (8 products)
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

      // CLOTHING CATEGORY (8 products)
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
      }
    ];

    // Add products to database
    for (const product of products) {
      try {
        // Check if product already exists
        const existingProduct = await productModel.findOne({ slug: product.slug });
        if (existingProduct) {
          console.log(`Product ${product.name} already exists, skipping...`);
          continue;
        }
        
        // Create new product
        await productModel.create(product);
        console.log(`✅ Added product: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error adding product ${product.name}:`, error.message);
      }
    }

    console.log('✅ All products added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

dbConnect();
