// Migration: Ensure all products have at least one image
// Usage: node Ecommerce/backend/scripts/migrations/2025-08-ensure-product-images.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const placeholder = 'https://via.placeholder.com/300';

const productSchema = new mongoose.Schema({ images: { type: [String], default: [] } }, { strict: false });
const Product = mongoose.model('products', productSchema, 'products');

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const noImages = await Product.updateMany(
      { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }] },
      { $set: { images: [placeholder] } }
    );

    console.log(`Updated ${noImages.modifiedCount} product(s) with placeholder image`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();

