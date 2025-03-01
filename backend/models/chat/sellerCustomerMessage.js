import { Schema, model } from "mongoose";

const sellerCustomerMsgSchema = new Schema({
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  receverId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unseen'
  }
}, { timestamps: true });

export default model('seller_customer_msgs', sellerCustomerMsgSchema);
