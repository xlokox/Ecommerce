// backend/utiles/tokenCreate.js

import dotenv from 'dotenv';

// 1️⃣ Load .env (from your current working directory, i.e. backend/.env)
dotenv.config();

// 2️⃣ Import JWT
import jwt from 'jsonwebtoken';

// 3️⃣ Read SECRET (or fallback to JWT_SECRET)
const SECRET = process.env.SECRET || process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error(
    'Missing JWT secret in environment. Please add SECRET=your_secret_here (or JWT_SECRET) to backend/.env'
  );
}

/**
 * Create a JWT valid for 7 days
 * @param {Object} data – payload (user id, role, etc.)
 * @returns {string} signed token
 */
export const createToken = (data) => {
  return jwt.sign(data, SECRET, { expiresIn: '7d' });
};
