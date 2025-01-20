import { createServer } from "http";
import app from "./app";
import { WebSocketManager } from "./WebSocketManager";
import { config } from "./config/config";

const PORT: string|number = config.port;
const BASE_URL: string = config.baseUrl;

const server = createServer(app);

// Create the WebSocketManager and pass the server instance
new WebSocketManager(server);

server.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}:${PORT}`);
});
