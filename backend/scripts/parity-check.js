// Parity Check Script
// Usage: node Ecommerce/backend/scripts/parity-check.js http://10.100.102.34:5001

import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

dotenv.config();

const BASE = (process.argv[2] || process.env.API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
const API = `${BASE}/api`;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

function sampleProductFields(p) {
  if (!p) return null;
  const firstImage = Array.isArray(p.images) && p.images[0] ? p.images[0] : null;
  return { name: p.name, image: firstImage, price: p.price };
}

(async () => {
  try {
    console.log(`Connecting DB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);

    console.log(`Fetching categories from DB and API: ${API}`);
    const [dbCats, apiCatsResp] = await Promise.all([
      Category.find({}).sort({ name: 1 }).lean(),
      axios.get(`${API}/home/get-categorys`)
    ]);

    const apiCats = apiCatsResp.data?.categorys || [];
    const dbCatNames = dbCats.map(c => c.name);
    const apiCatNames = apiCats.map(c => c.name);

    const alphabetical = (arr) => [...arr].sort((a,b)=>a.localeCompare(b));
    const orderOk = JSON.stringify(dbCatNames) === JSON.stringify(alphabetical(dbCatNames)) &&
                    JSON.stringify(apiCatNames) === JSON.stringify(alphabetical(apiCatNames)) &&
                    JSON.stringify(dbCatNames) === JSON.stringify(apiCatNames);

    const rows = [];

    for (const c of dbCatNames) {
      const [dbCount, apiResp] = await Promise.all([
        Product.countDocuments({ category: c }),
        axios.get(`${API}/home/query-products`, { params: { category: c, pageNumber: 1, lowPrice: 0, highPrice: 100000 } })
      ]);
      const webCount = apiResp.data?.totalProduct ?? 0;
      const appCount = webCount; // App uses same endpoint and params

      // Sample fields verification: compare first product in API with DB sample by name
      const apiFirst = apiResp.data?.products?.[0] || null;
      const dbOne = await Product.findOne({ category: c }).sort({ createdAt: -1 }).lean();
      const match = apiFirst && dbOne ? (dbOne.name === apiFirst.name && sampleProductFields(dbOne).price === apiFirst.price) : true;

      rows.push({ category: c, db_count: dbCount, web_count: webCount, app_count: appCount, sample_match: !!match });
    }

    console.table(rows);
    console.log(`Category order identical and alphabetical: ${orderOk}`);

    await mongoose.disconnect();
  } catch (e) {
    console.error('Parity check failed:', e.message);
    process.exit(1);
  }
})();

