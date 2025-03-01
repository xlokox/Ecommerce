// models/authOrder.js
import { Schema, model } from "mongoose";

const authOrderSchema = new Schema({
  orderId: {
    type: Schema.ObjectId,
    required: true
  },
  sellerId: {
    type: Schema.ObjectId,
    required: true
  },
  products: {
    type: Array,
    required: true  
  },
  price: {
    type: Number,
    required: true  
  },
  payment_status: {
    type: String,
    required: true  
  },
  shippingInfo: {
    type: String,
    required: true  
  },
  delivery_status: {
    type: String,
    required: true  
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

// ייצוא ברירת מחדל של המודל
export default model("authOrders", authOrderSchema);
// models/authOrder.js