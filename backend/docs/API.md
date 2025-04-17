# API Documentation

## Authentication
POST /api/login
POST /api/refresh-token

## Payments
GET /api/payment
POST /api/payment/stripe-connect
GET /api/payment/activate/:activeCode

## Security
- All endpoints require CSRF token
- Rate limiting: 100 requests per 15 minutes
- Authentication required for protected routes