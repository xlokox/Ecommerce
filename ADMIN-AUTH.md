# Admin Authentication for E-commerce Platform

This document explains how to set up and use admin authentication in the e-commerce platform.

## Creating an Admin User

To create an admin user, follow these steps:

1. Make sure your MongoDB database is running
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Run the admin creation script:
   ```bash
   # Using default admin credentials
   ./create-admin.sh

   # OR specify custom credentials
   ./create-admin.sh --name "Admin Name" --email "admin@yourdomain.com" --password "your-secure-password"
   ```

4. The script will create an admin user with the specified credentials (or default ones if not specified)

### Default Admin Credentials

If you run the script without any arguments, it will create an admin user with the following default credentials:

- **Name**: Admin
- **Email**: admin@example.com
- **Password**: admin123

## Accessing the Admin Dashboard

1. Open your browser and navigate to the dashboard URL (typically http://localhost:3000)
2. Click on "Admin Login" or navigate to `/admin/login`
3. Enter your admin credentials
4. After successful login, you will be redirected to the admin dashboard

## Admin Dashboard Features

The admin dashboard provides access to various management features:

- **Dashboard Overview**: View sales, orders, products, and seller statistics
- **Orders Management**: View and manage all orders
- **Category Management**: Add, edit, or remove product categories
- **Sellers Management**: View and manage seller accounts
- **Payment Requests**: Handle payment requests from sellers
- **Deactivated Sellers**: Manage deactivated seller accounts
- **Seller Requests**: Review and approve new seller registrations
- **Chat with Sellers**: Communicate with sellers through the platform

## Security Notes

- The admin dashboard is protected by role-based authentication
- Only users with the 'admin' role can access the admin dashboard
- If a non-admin user tries to access admin routes, they will be redirected to the unauthorized page
- Admin passwords are securely hashed before storing in the database
- JWT tokens are used for authentication and expire after 7 days

## Troubleshooting

If you encounter issues with admin authentication:

1. Make sure your MongoDB database is running
2. Check that the admin user was created successfully
3. Verify that you're using the correct credentials
4. Clear your browser cookies and local storage, then try again
5. Check the server logs for any authentication errors
