// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  // 1️⃣ Grab token from cookie or header
  let token =
    req.cookies?.accessToken ||
    req.cookies?.customerToken ||
    (req.header('Authorization')?.startsWith('Bearer ')
      ? req.header('Authorization').slice(7)
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 2️⃣ Ensure SECRET is available
  const SECRET = process.env.SECRET;
  if (!SECRET) {
    return res.status(500).json({ message: 'Server misconfigured: missing JWT SECRET' });
  }

  // 3️⃣ Verify JWT
  try {
    const decoded = jwt.verify(token, SECRET);
    req.id   = decoded.id;
    req.role = decoded.role;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
