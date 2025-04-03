import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise} A promise that resolves when connected to the database
 */
export const dbConnect = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);

    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ Database connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    throw error; // Rethrow to handle in the server.js
  }
};