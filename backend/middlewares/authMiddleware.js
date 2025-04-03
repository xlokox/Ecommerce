import jwt from 'jsonwebtoken';  // Import jsonwebtoken module for token verification

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authMiddleware = (req, res, next) => {
  // For development mode, you can bypass token verification
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    return next();
  }

  // Get token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : req.cookies.customerToken;

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.SECRET);

    // Add the decoded user information to the request object
    req.user = decoded;

    // If token contains an ID, add it to the request for convenience
    if (decoded.id) {
      req.id = decoded.id;
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
