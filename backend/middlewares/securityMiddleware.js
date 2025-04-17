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
