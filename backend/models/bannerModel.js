// models/bannerModel.js
import { Schema, model } from "mongoose";

const bannerSchema = new Schema({
  productId: {
    type: Schema.ObjectId,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
}, { timestamps: true });

// ייצוא ברירת מחדל של המודל
export default model("banners", bannerSchema);
