# API Documentation

This document provides details about the API endpoints available in the E-commerce application.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Most endpoints require authentication. Include the JWT token in the request:

- **Header**: `Authorization: Bearer YOUR_TOKEN`
- **Cookie**: The token is also stored in an HTTP-only cookie named `customerToken`

## Error Responses

Error responses follow this format:

```json
{
  "error": "Error message"
}
```

## Customer Authentication

### Register Customer

- **URL**: `/api/customer/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "Customer Name",
    "email": "customer@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Registration successful",
    "token": "JWT_TOKEN"
  }
  ```

### Login Customer

- **URL**: `/api/customer/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN"
  }
  ```

### Logout Customer

- **URL**: `/api/customer/logout`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Logout successful"
  }
  ```

## Admin Authentication

### Login Admin

- **URL**: `/api/admin-login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN"
  }
  ```

### Get User Info

- **URL**: `/api/get-user`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin|seller|customer"
  }
  ```

## Products

### Get All Products

- **URL**: `/api/home/get-products`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of products per page (default: 10)
  - `category`: Filter by category
  - `search`: Search term
- **Success Response**: `200 OK`
  ```json
  {
    "products": [
      {
        "id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "description": "Product description",
        "images": ["image_url"],
        "category": "Category Name",
        "stock": 10,
        "rating": 4.5
      }
    ],
    "totalProducts": 100,
    "currentPage": 1,
    "totalPages": 10
  }
  ```

### Get Product Details

- **URL**: `/api/home/product-details/:slug`
- **Method**: `GET`
- **Auth Required**: No
- **URL Parameters**:
  - `slug`: Product slug
- **Success Response**: `200 OK`
  ```json
  {
    "id": "product_id",
    "name": "Product Name",
    "slug": "product-name",
    "price": 99.99,
    "description": "Product description",
    "images": ["image_url"],
    "category": "Category Name",
    "stock": 10,
    "rating": 4.5,
    "reviews": [
      {
        "id": "review_id",
        "user": "User Name",
        "rating": 5,
        "comment": "Great product!",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Add Product (Seller/Admin)

- **URL**: `/api/product-add`
- **Method**: `POST`
- **Auth Required**: Yes (Seller or Admin)
- **Body**:
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 10,
    "category": "category_id",
    "images": ["image_url"]
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Product added successfully",
    "product": {
      "id": "product_id",
      "name": "Product Name",
      "price": 99.99
    }
  }
  ```

### Update Product (Seller/Admin)

- **URL**: `/api/product-update`
- **Method**: `POST`
- **Auth Required**: Yes (Seller or Admin)
- **Body**:
  ```json
  {
    "productId": "product_id",
    "name": "Updated Product Name",
    "description": "Updated product description",
    "price": 89.99,
    "stock": 15,
    "category": "category_id"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Product updated successfully",
    "product": {
      "id": "product_id",
      "name": "Updated Product Name",
      "price": 89.99
    }
  }
  ```

## Orders

### Place Order

- **URL**: `/api/home/order/place-order`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "userId": "user_id",
    "products": [
      {
        "productId": "product_id",
        "quantity": 2,
        "price": 99.99
      }
    ],
    "shippingInfo": {
      "address": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345",
      "country": "Country",
      "phone": "1234567890"
    },
    "paymentMethod": "card|cash",
    "totalPrice": 199.98
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Order placed successfully",
    "order": {
      "id": "order_id",
      "totalPrice": 199.98,
      "status": "pending"
    }
  }
  ```

### Get Customer Orders

- **URL**: `/api/home/customer/get-orders/:customerId/:status`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `customerId`: Customer ID
  - `status`: Order status (pending|processing|shipped|delivered|cancelled)
- **Success Response**: `200 OK`
  ```json
  {
    "orders": [
      {
        "id": "order_id",
        "products": [
          {
            "productId": "product_id",
            "name": "Product Name",
            "quantity": 2,
            "price": 99.99
          }
        ],
        "totalPrice": 199.98,
        "status": "pending",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Get Order Details

- **URL**: `/api/home/customer/get-order-details/:orderId`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `orderId`: Order ID
- **Success Response**: `200 OK`
  ```json
  {
    "id": "order_id",
    "products": [
      {
        "productId": "product_id",
        "name": "Product Name",
        "quantity": 2,
        "price": 99.99,
        "image": "image_url"
      }
    ],
    "shippingInfo": {
      "address": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345",
      "country": "Country",
      "phone": "1234567890"
    },
    "paymentMethod": "card|cash",
    "totalPrice": 199.98,
    "status": "pending",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

## Categories

### Get All Categories

- **URL**: `/api/home/get-categorys`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "categories": [
      {
        "id": "category_id",
        "name": "Category Name",
        "image": "image_url"
      }
    ]
  }
  ```

### Add Category (Admin)

- **URL**: `/api/category-add`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Body**:
  ```json
  {
    "name": "Category Name",
    "image": "image_url"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Category added successfully",
    "category": {
      "id": "category_id",
      "name": "Category Name"
    }
  }
  ```

## Chat

### Add Customer Friend (Customer)

- **URL**: `/api/chat/customer/add-customer-friend`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "sellerId": "seller_id",
    "userId": "user_id"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "myFriends": [
      {
        "fdId": "seller_id",
        "name": "Seller Name",
        "image": "image_url"
      }
    ],
    "currentFriend": {
      "fdId": "seller_id",
      "name": "Seller Name",
      "image": "image_url"
    },
    "messages": []
  }
  ```

### Send Message to Seller (Customer)

- **URL**: `/api/chat/customer/send-message-to-seller`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "userId": "user_id",
    "text": "Hello, I have a question about your product",
    "sellerId": "seller_id",
    "name": "Customer Name"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": {
      "id": "message_id",
      "senderId": "user_id",
      "senderName": "Customer Name",
      "receverId": "seller_id",
      "message": "Hello, I have a question about your product",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

## Additional Notes

- All dates are in ISO 8601 format
- All IDs are strings
- All endpoints return JSON
- All endpoints that require authentication will return a 401 Unauthorized response if the token is missing or invalid
