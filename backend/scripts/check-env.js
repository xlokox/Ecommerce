/**
 * Environment Variables Checker
 * 
 * This script checks if all required environment variables are set.
 * Run this script before starting the server to ensure all required
 * environment variables are properly configured.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Define required environment variables
const requiredEnvVars = [
  { name: 'PORT', defaultValue: '5001' },
  { name: 'NODE_ENV', defaultValue: 'development' },
  { name: 'DB_URL', defaultValue: null },
  { name: 'JWT_SECRET', defaultValue: null, alias: 'SECRET' },
  { name: 'CLOUDINARY_CLOUD_NAME', defaultValue: null, alias: 'cloud_name' },
  { name: 'CLOUDINARY_API_KEY', defaultValue: null, alias: 'api_key' },
  { name: 'CLOUDINARY_API_SECRET', defaultValue: null, alias: 'api_secret' },
];

// Check if all required environment variables are set
let missingVars = [];
let usingDefaultVars = [];
let usingAliasVars = [];

for (const envVar of requiredEnvVars) {
  const { name, defaultValue, alias } = envVar;
  
  // Check if the environment variable is set
  if (!process.env[name]) {
    // Check if there's an alias
    if (alias && process.env[alias]) {
      usingAliasVars.push({ name, alias });
      continue;
    }
    
    // Check if there's a default value
    if (defaultValue !== null) {
      usingDefaultVars.push({ name, defaultValue });
      process.env[name] = defaultValue;
      continue;
    }
    
    // If no alias or default value, add to missing vars
    missingVars.push(name);
  }
}

// Print results
console.log('\n🔍 Environment Variables Check');
console.log('==============================');

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(name => console.error(`   - ${name}`));
  console.error('\nPlease set these variables in your .env file or environment.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set.');
}

if (usingDefaultVars.length > 0) {
  console.log('\n⚠️  Using default values for:');
  usingDefaultVars.forEach(({ name, defaultValue }) => 
    console.log(`   - ${name} = ${defaultValue}`)
  );
}

if (usingAliasVars.length > 0) {
  console.log('\n⚠️  Using alias values for:');
  usingAliasVars.forEach(({ name, alias }) => 
    console.log(`   - ${name} (using ${alias} = ${process.env[alias]})`)
  );
  console.log('\n   Consider updating your .env file to use the new variable names.');
}

console.log('\n📊 Current Environment:');
console.log(`   - NODE_ENV = ${process.env.NODE_ENV}`);
console.log(`   - PORT = ${process.env.PORT}`);
console.log(`   - DB_URL = ${process.env.DB_URL.substring(0, 20)}...`);
console.log(`   - JWT_SECRET = ${process.env.JWT_SECRET ? '********' : 'Not Set'}`);
console.log(`   - CLOUDINARY = ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not Configured'}`);

console.log('\n✨ Environment check completed successfully!\n');
