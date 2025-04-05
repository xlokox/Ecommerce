import io from 'socket.io-client'

// API configuration with environment awareness
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment ? 'http://localhost:5001' : process.env.REACT_APP_API_URL || '';

export const overrideStyle = {
    display : 'flex',
    margin : '0 auto',
    height: '24px',
    justifyContent : 'center',
    alignItems : 'center'
}

// Create socket connection with proper configuration
export const socket = io(API_BASE_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    transports: ['websocket', 'polling'],
    autoConnect: false
});

// Connect to socket server with error handling
try {
    socket.connect();

    // Add event listeners for connection status
    socket.on('connect', () => {
        console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
            // the disconnection was initiated by the server, reconnect manually
            setTimeout(() => {
                socket.connect();
            }, 1000);
        }
    });
} catch (error) {
    console.error('Socket initialization error:', error);
}
