import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
    console.log("Database connected..");
  } catch (error) {
    console.log(error.message);
  }
};
// Compare this snippet from Ecommerce/backend/models/categoryModel.js: