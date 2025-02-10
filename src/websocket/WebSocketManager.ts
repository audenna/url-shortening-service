import { Server, Socket } from "socket.io";
import { ISocketResponse } from "../types";

class WebSocketManager {
    private io: Server | undefined;
    private clients: Map<string, Socket>;
    private pendingMessages: Map<string, ISocketResponse>;

    constructor() {
        this.clients = new Map();
        this.pendingMessages = new Map();
    }

    public initialize(io: Server): void {
        this.io = io;
        this.setupListeners();
    }

    private setupListeners(): void {
        if (this.io) {
            this.io.on("connection", (socket: Socket) => {
                try {
                    console.log("Socket.IO client connected");
                    this.addSocketClient(socket);

                    this.resendPendingMessage(socket);

                    socket.on("acknowledge", (data) => {
                        console.log(`Acknowledgment received from ${socket.id}:`, data);
                    });

                    socket.on("disconnect", () => {
                        console.log("Socket.IO client disconnected");
                        this.removeSocketClient(socket.id); // Handle the connected socket cleanup
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

    private resendPendingMessage(socket: Socket): void {
        try {
            const message: ISocketResponse | undefined = this.pendingMessages.get(socket.id);
            if (message) {
                this.sendToClient(socket, message);
                this.pendingMessages.delete(socket.id);
            }
        } catch (e) {
            console.log("Unable to resend pending messages to client", e);
            return;
        }
    }

    private addSocketClient(socket: Socket | undefined): void {
        try {
            if (!socket || socket.disconnected) {
                console.log("Invalid or disconnected WebSocket client");
                return;
            }

            // get the IP address of the client
            const clientId: string = socket.handshake.headers["client-id"] as string;
            if (! clientId) {
                console.warn("Client does not have a client ID")
                socket.disconnect(true);
            }

            this.clients.set(clientId, socket);
            console.log(`WebSocket client set to: ${clientId}`);

        } catch (error) {
            console.error("Error in setSocketClient:", error);
            socket?.disconnect(true);
        }
    }

    private removeSocketClient(socketId: string): void {
        this.clients.delete(socketId);
    }

    public getConnectedClientByIdentifier(clientId: string | undefined): Socket | null {
        if (!clientId) return null;

        return this.clients.get(clientId) || null;
    }

    public sendToClient(socket: Socket, message: ISocketResponse): void {
        try {
            socket.emit("shortenedURL", message);
            console.log(`A shortened URL: ${message} has been sent to the client: ${socket.id}`);
        } catch (e) {
            console.error(e);
            this.pendingMessages.set(socket.id, message);
        }
    }
}

export default new WebSocketManager();
