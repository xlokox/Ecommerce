// Normalize images and discounts for all products
// - Ensure every product has at least one non-empty image URL
// - Set a subset of products to have discount=0 (no sale)
// - Create/update a set of discounted products for variety
// Usage: node Ecommerce/backend/scripts/fix-images-and-discounts.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const PLACEHOLDER = 'https://via.placeholder.com/300';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected: ${MONGODB_URI}`);

    // 1) Fix images: if images missing/empty/blank strings -> set placeholder
    const all = await Product.find({}).lean();
    let fixedImages = 0;
    for (const p of all) {
      const imgs = Array.isArray(p.images) ? p.images.filter(x => typeof x === 'string' && x.trim().length > 0) : [];
      if (imgs.length === 0) {
        await Product.updateOne({ _id: p._id }, { $set: { images: [PLACEHOLDER] } });
        fixedImages++;
      }
    }
    console.log(`Fixed images for ${fixedImages} product(s)`);

    // 2) Normalize discounts: ensure not all products are on sale
    //    Set discount=0 for every 2nd product; keep others as-is if already discounted
    const products = await Product.find({}).sort({ createdAt: -1 });
    let zeroed = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const desired = (i % 2 === 0) ? 0 : (p.discount || 0);
      if (p.discount !== desired) {
        await Product.updateOne({ _id: p._id }, { $set: { discount: desired } });
        zeroed++;
      }
    }
    console.log(`Updated discount=0 on ${zeroed} product(s)`);

    // 3) Ensure some discounted products exist with realistic values (10-40%)
    const needDiscounted = 8;
    const discounted = await Product.find({ discount: { $gt: 0 } }).limit(needDiscounted);
    if (discounted.length < needDiscounted && products.length) {
      const toUpdate = products.slice(0, needDiscounted - discounted.length);
      for (const p of toUpdate) {
        const pct = 10 + Math.floor(Math.random() * 31); // 10..40
        await Product.updateOne({ _id: p._id }, { $set: { discount: pct } });
      }
      console.log(`Raised discounts on ${toUpdate.length} product(s)`);
    } else {
      console.log(`Already have ${discounted.length} discounted product(s)`);
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error('Normalization failed:', e);
    process.exit(1);
  }
})();

