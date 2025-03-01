import { Schema, model } from "mongoose";

const stripeSchema = new Schema({
  sellerId: {
    type: Schema.ObjectId,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true  
  } 
}, { timestamps: true });

export default model('stripes', stripeSchema);
