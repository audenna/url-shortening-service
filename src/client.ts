import io from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:4500');  // Replace with your WebSocket server URL

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('shortenedURL', (shortenedURL: string) => {
    console.log('Received shortened URL:', shortenedURL);  // Logs the shortened URL from the server
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});
