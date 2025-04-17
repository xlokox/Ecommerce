import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join('logs', 'security.log'),
      level: 'info'
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export const loggingMiddleware = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
};