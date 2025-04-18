import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    // Check for token in cookies first
    const cookieToken = req.cookies?.accessToken;

    // Then check Authorization header (for API requests)
    let headerToken = null;
    const authHeader = req.headers.authorization;

    if (authHeader) {
      // Handle both "Bearer token" and just "token" formats
      headerToken = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;
    }

    // Use whichever token is available
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please login.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request object
    req.id = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please login again.' });
    }

    return res.status(500).json({ error: 'Authentication error.' });
  }
};

export default authMiddleware;
