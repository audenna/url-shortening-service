import { io } from 'socket.io-client';
import { config } from "./config/config";
import {ISocketResponse} from "./types";

// generate a random identifier
const clientId: string = `client-${Math.random().toString(36).substring(7)}`;

// Connect to the Socket.IO server
const socket = io(`${config.baseUrl}:${config.port}`, {
    extraHeaders: {
        "client-id": clientId, // Attach client-id in headers
    }
});

socket.on('connect', () => {
    console.log(`Connected to Socket.IO server: ${socket.id} with client identifier: ${clientId}`);
});

socket.on('shortenedURL', (data: ISocketResponse) => {
    console.log('Received shortened URL:', data);  // Logs the shortened URL from the server

    // Send acknowledgment back to the server
    socket.emit("acknowledge", data);

    console.log(`Acknowledgment sent for URL: ${data.shortenedURL}`);
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});
