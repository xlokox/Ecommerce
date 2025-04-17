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

// Sample products
const products = [
  {
    name: 'Smartphone',
    slug: 'smartphone',
    category: 'Electronics',
    brand: 'Apple',
    price: 699,
    stock: 50,
    discount: 10,
    description: 'Latest smartphone with amazing features',
    shopName: 'Tech Store',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Laptop',
    slug: 'laptop',
    category: 'Electronics',
    brand: 'Dell',
    price: 1299,
    stock: 30,
    discount: 15,
    description: 'Powerful laptop for work and gaming',
    shopName: 'Tech Store',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2920&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'T-Shirt',
    slug: 't-shirt',
    category: 'Clothing',
    brand: 'Nike',
    price: 29.99,
    stock: 100,
    discount: 5,
    description: 'Comfortable cotton t-shirt',
    shopName: 'Fashion Hub',
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Coffee Maker',
    slug: 'coffee-maker',
    category: 'Home & Kitchen',
    brand: 'Breville',
    price: 89.99,
    stock: 40,
    discount: 20,
    description: 'Automatic coffee maker for your morning brew',
    shopName: 'Home Essentials',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Novel',
    slug: 'novel',
    category: 'Books',
    brand: 'Penguin',
    price: 19.99,
    stock: 200,
    discount: 0,
    description: 'Bestselling novel that will keep you engaged',
    shopName: 'Book World',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.0.3'
    ]
  },
  {
    name: 'Toy Car',
    slug: 'toy-car',
    category: 'Toys',
    brand: 'Hot Wheels',
    price: 24.99,
    stock: 75,
    discount: 10,
    description: 'Remote controlled toy car for kids',
    shopName: 'Toy Land',
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
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
