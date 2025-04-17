import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const securityMiddleware = [
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.NODE_ENV === 'production' ? 'https://*.your-domain.com' : 'http://localhost:*']
    }
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP
    message: { error: 'Too many requests' },
    standardHeaders: true,
    legacyHeaders: false
  })
];

export const validateRequest = (req, res, next) => {
  const token = req.cookies.accessToken;
  const csrfToken = req.headers['x-csrf-token'];
  
  if (!token || !csrfToken) {
    return res.status(403).json({ error: 'Invalid request' });
  }
  next();
};
