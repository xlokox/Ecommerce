#!/bin/bash

# Script to create an admin user

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Check if the script exists
if [ ! -f "./scripts/createAdmin.js" ]; then
    echo "❌ Admin creation script not found at ./scripts/createAdmin.js"
    exit 1
fi

# Run the script
echo "🔹 Creating admin user..."
node scripts/createAdmin.js "$@"

# Check if the script was successful
if [ $? -eq 0 ]; then
    echo "✅ Admin user created successfully!"
    echo "🔹 You can now log in with the admin credentials."
    echo "🔹 Default credentials (if not specified):"
    echo "   Email: admin@example.com"
    echo "   Password: admin123"
else
    echo "❌ Failed to create admin user. Check the error messages above."
fi
