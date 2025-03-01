import { Schema, model } from "mongoose";

const sellerCustomerSchema = new Schema({
  myId: {
    type: String,
    required: true
  },
  myFriends: {
    type: Array,
    default: []
  }
}, { timestamps: true });

export default model('seller_customers', sellerCustomerSchema);
