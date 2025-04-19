# Admin Scripts

This directory contains utility scripts for the e-commerce application.

## Create Admin User

The `createAdmin.js` script allows you to create an admin user in the database.

### Usage

```bash
# Using default admin credentials
node scripts/createAdmin.js

# Specifying custom admin credentials
node scripts/createAdmin.js --name "Your Name" --email "your-email@example.com" --password "your-password" --image "https://example.com/your-image.jpg"
```

### Default Admin Credentials

If you run the script without any arguments, it will create an admin user with the following default credentials:

- **Name**: Admin
- **Email**: admin@example.com
- **Password**: admin123
- **Image**: A generated avatar image

### Notes

- The script will check if an admin with the specified email already exists
- If an admin already exists, the script will not create a new one
- The password will be securely hashed before storing in the database
