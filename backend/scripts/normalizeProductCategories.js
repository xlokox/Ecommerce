import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function connect() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log(`✅ Connected to MongoDB: ${MONGODB_URI}`);
}

function isLikelyObjectId(value) {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}

async function normalize() {
  const categories = await Category.find({}).lean();
  const catIdToName = new Map(categories.map(c => [String(c._id), c.name]));
  const catNameSet = new Set(categories.map(c => c.name));

  const products = await Product.find({}).lean();

  let updated = 0;
  let unmapped = [];

  for (const p of products) {
    let current = p.category;
    let desiredName = null;

    if (typeof current === 'string' && catNameSet.has(current)) {
      // Already a valid category name
      continue;
    }

    // If it's an ObjectId string or a stored ObjectId
    const idString = (typeof current === 'string' && isLikelyObjectId(current))
      ? current
      : (current && current._id ? String(current._id) : null);

    if (idString && catIdToName.has(idString)) {
      desiredName = catIdToName.get(idString);
    }

    if (!desiredName) {
      unmapped.push({ _id: p._id, name: p.name, category: current });
      continue;
    }

    await Product.updateOne({ _id: p._id }, { $set: { category: desiredName } });
    updated++;
  }

  console.log(`\n🔁 Normalization complete: updated ${updated} product(s).`);
  if (unmapped.length) {
    console.log(`\n⚠️ ${unmapped.length} product(s) have categories that could not be mapped to any existing category:`);
    console.table(unmapped.slice(0, 20));
    console.log('Tip: Create matching categories in the dashboard or fix these manually.');
  } else {
    console.log('\n✅ All products are tied to valid category names.');
  }
}

connect()
  .then(normalize)
  .then(() => process.exit(0))
  .catch(err => { console.error('❌ Error:', err); process.exit(1); });

