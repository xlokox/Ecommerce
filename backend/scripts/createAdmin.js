// backend/scripts/createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import adminModel from '../models/adminModel.js';

// Load environment variables
dotenv.config();

// Default admin credentials (can be overridden by command line arguments)
const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: '123456',
  image: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to MongoDB at:', uri);

    await mongoose.connect(uri);
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    return false;
  }
};

// Create admin user
const createAdmin = async (adminData = {}) => {
  try {
    // Merge default admin with provided data
    const adminInfo = {
      ...DEFAULT_ADMIN,
      ...adminData
    };

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: adminInfo.email });
    if (existingAdmin) {
      console.log(`⚠️ Admin with email ${adminInfo.email} already exists`);
      return false;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminInfo.password, 10);

    // Create admin user
    const admin = await adminModel.create({
      name: adminInfo.name,
      email: adminInfo.email,
      password: hashedPassword,
      image: adminInfo.image,
      role: 'admin'
    });

    console.log(`✅ Admin user created successfully: ${admin.name} (${admin.email})`);
    return true;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    return false;
  }
};

// Parse command line arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  const adminData = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];

    if (key && value) {
      adminData[key] = value;
    }
  }

  return adminData;
};

// Main function
const main = async () => {
  // Connect to database
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  // Parse command line arguments
  const adminData = parseArgs();

  // Create admin user
  const created = await createAdmin(adminData);

  // Disconnect from database
  await mongoose.disconnect();
  console.log('✅ Disconnected from database');

  // Exit with appropriate code
  process.exit(created ? 0 : 1);
};

// Run the script
main();
