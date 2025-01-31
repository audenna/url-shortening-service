import { Server } from "http";
import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
import { UrlController } from "./controllers/UrlController";

export class WebSocketManager {
    private io: SocketIOServer;

    constructor(server: Server) {
        this.io = new SocketIOServer(server);
        const controller = UrlController.getInstance();  // Get the singleton instance of UrlController

        this.io.on("connection", (socket: Socket) => {
            try {

                controller.setSocketClient(socket);
                console.log("Socket.IO client connected");

                // Set the socket client in the controller
                // @ts-ignore
                controller.setSocketClient(socket);

                socket.on("disconnect", () => {
                    console.log("Socket.IO client disconnected");
                    controller.removeSocketClient(); // Handle cleanup
                });

                socket.on("error", (error) => {
                    console.error("Socket.IO error:", error);
                });

            } catch (error) {
                console.error("Error handling Socket.IO connection:", error);
            }
        });
    }
}
