import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  slug: { type: String, required: true },
  discount: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 }
}, { 
  timestamps: true,
  collection: 'wishlist' // כך לא יווצר שם טבלה שגוי
});

// ייצוא נכון ב-ES Modules
export default model('Wishlist', wishlistSchema);
