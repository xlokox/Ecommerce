import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log(`✅ Connected to MongoDB: ${MONGODB_URI}`);
};

const DOGS_CATEGORY = {
  name: 'Dogs',
  slug: 'dogs',
  image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'
};

const DOG_PRODUCTS = [
  { name: 'Premium Dog Food 10kg', slug: 'premium-dog-food-10kg', category: 'Dogs', brand: 'CanineCare', price: 49.99, stock: 120, discount: 10, description: 'High-protein dry food suitable for all breeds', shopName: 'Pet Store', rating: 4.6, images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Adjustable Dog Harness', slug: 'adjustable-dog-harness', category: 'Dogs', brand: 'PawFit', price: 24.99, stock: 80, discount: 5, description: 'Breathable and comfortable harness for daily walks', shopName: 'Pet Store', rating: 4.5, images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Durable Chew Toy', slug: 'durable-chew-toy', category: 'Dogs', brand: 'K9Play', price: 12.99, stock: 200, discount: 0, description: 'Veterinarian-approved chew toy for strong chewers', shopName: 'Pet Store', rating: 4.7, images: ['https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Orthopedic Dog Bed', slug: 'orthopedic-dog-bed', category: 'Dogs', brand: 'SleepyPaws', price: 79.99, stock: 40, discount: 15, description: 'Memory foam bed for superior joint support', shopName: 'Pet Store', rating: 4.8, images: ['https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Stainless Steel Dog Bowl', slug: 'stainless-steel-dog-bowl', category: 'Dogs', brand: 'PetEssentials', price: 14.99, stock: 150, discount: 0, description: 'Non-slip, dishwasher-safe food bowl', shopName: 'Pet Store', rating: 4.4, images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Dog Shampoo Sensitive Skin', slug: 'dog-shampoo-sensitive-skin', category: 'Dogs', brand: 'GentlePup', price: 11.99, stock: 90, discount: 8, description: 'Hypoallergenic shampoo with aloe and oatmeal', shopName: 'Pet Store', rating: 4.3, images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Reflective Dog Leash', slug: 'reflective-dog-leash', category: 'Dogs', brand: 'NightPaw', price: 16.99, stock: 110, discount: 10, description: 'Strong nylon leash with reflective stitching for safety', shopName: 'Pet Store', rating: 4.5, images: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
  { name: 'Healthy Dog Treats', slug: 'healthy-dog-treats', category: 'Dogs', brand: 'GoodBoi', price: 9.99, stock: 180, discount: 5, description: 'Grain-free treats made with real chicken', shopName: 'Pet Store', rating: 4.6, images: ['https://images.unsplash.com/photo-1583511655936-0700d874f1fb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3'] },
];

const upsertDogs = async () => {
  // Ensure category exists
  let dogsCat = await Category.findOne({ name: DOGS_CATEGORY.name });
  if (!dogsCat) {
    dogsCat = await Category.create(DOGS_CATEGORY);
    console.log('✅ Created Dogs category');
  } else {
    console.log('ℹ️ Dogs category already exists');
  }

  // Upsert each product by slug
  for (const p of DOG_PRODUCTS) {
    const existing = await Product.findOne({ slug: p.slug });
    if (existing) {
      await Product.updateOne({ _id: existing._id }, { $set: p });
      console.log(`🔁 Updated: ${p.name}`);
    } else {
      await Product.create(p);
      console.log(`✅ Created: ${p.name}`);
    }
  }
};

connectDB()
  .then(upsertDogs)
  .then(() => { console.log('🎉 Done adding Dogs products'); process.exit(0); })
  .catch(err => { console.error('❌ Error:', err); process.exit(1); });

