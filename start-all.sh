#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting E-commerce Application...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to continue.${NC}"
    exit 1
fi

# Function to check if a port is in use
is_port_in_use() {
    lsof -i:"$1" &> /dev/null
}

# Check if required ports are available
if is_port_in_use 5001; then
    echo -e "${RED}Port 5001 is already in use. Please free up this port for the backend server.${NC}"
    exit 1
fi

if is_port_in_use 3000; then
    echo -e "${RED}Port 3000 is already in use. Please free up this port for the frontend.${NC}"
    exit 1
fi

if is_port_in_use 3001; then
    echo -e "${RED}Port 3001 is already in use. Please free up this port for the dashboard.${NC}"
    exit 1
fi

# Start backend server
echo -e "${YELLOW}Starting backend server...${NC}"
cd backend
npm run dev:safe &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 5

# Start frontend
echo -e "${YELLOW}Starting frontend...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Start dashboard
echo -e "${YELLOW}Starting dashboard...${NC}"
cd dashboard
npm start &
DASHBOARD_PID=$!
cd ..

echo -e "${GREEN}All services started!${NC}"
echo -e "${GREEN}Backend running on http://localhost:5001${NC}"
echo -e "${GREEN}Frontend running on http://localhost:3000${NC}"
echo -e "${GREEN}Dashboard running on http://localhost:3001${NC}"

# Function to handle script termination
cleanup() {
    echo -e "${YELLOW}Shutting down all services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID $DASHBOARD_PID 2>/dev/null
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

# Keep the script running
wait
