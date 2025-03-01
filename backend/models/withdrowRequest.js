import { Schema, model } from "mongoose";

const withdrowSchema = new Schema({
  sellerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

export default model('withdrowRequest', withdrowSchema);