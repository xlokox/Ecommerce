import { Schema, model } from "mongoose";

const productSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'sellers' },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Made optional with default 0
  description: { type: String, default: '' }, // Made optional with default empty string
  shopName: { type: String, default: 'EasyShop' }, // Made optional with default value
  images: { type: Array, default: [] }, // Made optional with default empty array
  rating: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index(
  { name: 'text', category: 'text', brand: 'text', description: 'text' },
  { weights: { name: 5, category: 4, brand: 3, description: 2 } }
);

export default model("products", productSchema);