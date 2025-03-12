import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number, required: true },
  description: { type: String, required: true },
  shopName: { type: String, required: true },
  images: { type: Array, required: true },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index(
  { name: 'text', category: 'text', brand: 'text', description: 'text' },
  { weights: { name: 5, category: 4, brand: 3, description: 2 } }
);

export default model("products", productSchema);