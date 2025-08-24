import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log(`\n✅ Connected: ${MONGODB_URI}`);

  const categories = await Category.find({}).sort({ name: 1 }).lean();
  const products = await Product.find({}).lean();

  // Build counts
  const counts = {};
  for (const c of categories) counts[c.name] = 0;

  const unknown = [];
  for (const p of products) {
    const catName = typeof p.category === 'string' ? p.category : (p.category?.name || String(p.category));
    if (counts.hasOwnProperty(catName)) {
      counts[catName]++;
    } else {
      unknown.push({ _id: p._id.toString(), name: p.name, category: catName });
    }
  }

  console.log('\n📦 Category counts:');
  const rows = Object.entries(counts).map(([name, count]) => ({ Category: name, Products: count }));
  console.table(rows);

  if (unknown.length) {
    console.log(`\n⚠️ Found ${unknown.length} product(s) with unmatched category:`);
    console.table(unknown.slice(0, 20));
  } else {
    console.log('\n✅ All products mapped to valid categories');
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });

