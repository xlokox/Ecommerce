#!/bin/bash

echo "Starting E-commerce Application …"

# Start backend
echo "Starting backend server …"
cd backend
npm install
npm run dev &
cd ..

# Start frontend
echo "Starting frontend …"
cd frontend
npm install
npm start &
cd ..

# Start dashboard
echo "Starting dashboard …"
cd dashboard
npm install
npm start &
cd ..

echo "All services started!"
