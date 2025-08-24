// Seed 8 products into the "Dogs" category
// Usage: node Ecommerce/backend/scripts/seed-dogs-products.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const products = Array.from({ length: 8 }).map((_, i) => ({
  name: `Dogs Product ${i + 1}`,
  slug: `dogs-product-${i + 1}`,
  description: 'Dog care product',
  price: 19.99 + i,
  stock: 50,
  rating: 4,
  images: ['https://via.placeholder.com/300'],
  brand: 'EasyShop',
  discount: 0,
  shopName: 'EasyShop',
  sellerId: null,
  // category filled after we find or create Dogs category
}));

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected: ${MONGODB_URI}`);

    let dogs = await Category.findOne({ name: 'Dogs' });
    if (!dogs) {
      dogs = await Category.create({ name: 'Dogs', slug: 'dogs' });
      console.log('Created Dogs category');
    }

    // Seed products with category name for consistency with existing logic
    for (const p of products) {
      const exists = await Product.findOne({ slug: p.slug });
      if (exists) continue;
      await Product.create({ ...p, category: dogs.name, categoryName: dogs.name });
    }
    const count = await Product.countDocuments({ category: dogs.name });
    console.log(`Dogs products count: ${count}`);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

