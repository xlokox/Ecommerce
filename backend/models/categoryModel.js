import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true }
}, { timestamps: true });

categorySchema.index({ name: 'text' });

export default model("categorys", categorySchema);
// Compare this snippet from Ecommerce/backend/models/userModel.js: