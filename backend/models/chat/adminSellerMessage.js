// models/chat/adminSellerMessage.js
import { Schema, model } from "mongoose";

const adminSellerMessageSchema = new Schema({
  senderId: { type: String, required: true },
  receverId: { type: String, required: true },
  message: { type: String, required: true },
  senderName: { type: String, required: true }
}, { timestamps: true });

// ייצוא ברירת מחדל של המודל
export default model("adminSellerMessages", adminSellerMessageSchema);
// Compare this snippet from Ecommerce/backend/models/productModel.js:
// import { Schema, model } from "mongoose";