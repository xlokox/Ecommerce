import io from 'socket.io-client'

export const overrideStyle = {
    display : 'flex',
    margin : '0 auto',
    height: '24px',
    justifyContent : 'center',
    alignItems : 'center'
}

// 🚀 Enhanced Socket Connection with Auto-Reconnection
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';
export const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,
    transports: ['websocket', 'polling']
});

// 🔧 Socket Connection Logging
socket.on('connect', () => {
    console.log('✅ Dashboard Socket Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('❌ Dashboard Socket Disconnected:', reason);
});

socket.on('connect_error', (error) => {
    console.error('🔥 Dashboard Socket Connection Error:', error);
});

socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Dashboard Socket Reconnected after', attemptNumber, 'attempts');
});
