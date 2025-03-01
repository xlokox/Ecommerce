// utiles/tokenCreate.js
import jwt from 'jsonwebtoken';

export const createToken = (data) => {
  return jwt.sign(data, process.env.SECRET, { expiresIn: '7d' });
};
// Ecommerce/backend/controllers/authControllers.js