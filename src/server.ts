import { createServer } from "http";
import app from "./app";
import { config } from "./config/config";
import { Server } from "socket.io";
import WebSocketManager from "./websocket/WebSocketManager";

const PORT: string|number = config.port;
const BASE_URL: string = config.baseUrl;

// Create the HTTP server
const server = createServer(app);
// Create the WebSocketManager and pass the server instance and export a reusable instance of it
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Initialize WebSocket Manager
WebSocketManager.initialize(io);

server.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}:${PORT}`);
});

// import mongoose from 'mongoose';
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener') .then(() => { console.log('MongoDB Connected'); app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); }) .catch(err => console.error(err));
//
// MONGO_URI=mongodb://localhost:27017/url-shortener
