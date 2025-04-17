import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    // Use MONGODB_URI from .env file, with a fallback
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to MongoDB at:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
};
// Compare this snippet from Ecommerce/backend/models/categoryModel.js: