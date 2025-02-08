import { Request, Response, NextFunction } from 'express';
import webSocketManager from "../websocket/WebSocketManager";
import { Socket } from "socket.io";

export const ValidateSocketHeader = (req: Request, res: Response, next: NextFunction): void => {
    const clientId: string | undefined = req.headers['client-id'] as string | undefined;
    if (!clientId) {
        res.status(400).json({ error: "Client-ID header is required" });
        return;
    }
    try {
        const socket: Socket | null = webSocketManager.getConnectedClientByIdentifier(clientId);
        if (!socket) {
            console.warn(`No active WebSocket connection found for clientId: ${clientId}`);
            res.status(400).json({ error: "No active WebSocket connection found for this client." });
            return;
        }

        // Attach the socket to the request object
        (req as any).activeSocket = socket;

        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "An internal error occurred."});
        return;
    }
}
