import { Request, Response } from "express";
import { UrlService } from "../services/UrlService";
import WebSocketManager from "../websocket/WebSocketManager";
import { Socket } from "socket.io";

export class UrlController {
    private static instance: UrlController | null = null;
    private urlService: UrlService;

    constructor() {
        this.urlService = new UrlService();
    }

    /**
     * Here, I implemented a Singleton pattern to enable the Controller instance be instantiated only once at runtime.
     * This prevents the server from creating multiple instances of this controller as it holds the Realtime notification usage
     *
     */
    static getInstance(): UrlController {
        if (!UrlController.instance) {
            UrlController.instance = new UrlController();
        }

        return UrlController.instance;
    }
    /**
     * This handles the incoming request for Url shortening
     *  It accepts and validates the Url before processing it
     *
     * @param req
     * @param res
     */
    postUrl = async (req: Request, res: Response): Promise<void> => {
        try {

            // Extract the client’s IP address from the request
            const clientId: string | undefined = req.ip;
            console.log(`ClientID: ${clientId}`);
            // Extract the url from the body of the request
            const { url } = req.body;

            // Ensure there’s a connected WebSocket for this client
            const socket: Socket | null = WebSocketManager.getSocketIdForClient(clientId);
            if (!socket) {
                res.status(400).json({ error: "No active WebSocket connection found for client." });
                return;
            }

            // handle the storage of the url
            await this.urlService.handleUrlShortening(url, socket);

            res.status(202).send({ message: "You should receive a Shortened URL via a WebSocket connection shortly" });

        } catch (error) {
            console.error("Error in postUrl:", error);
            res.status(500).send({ error: "Internal server error" });
        }
    };

    getUrl = async (req: Request, res: Response): Promise<void> => {
        const { shortCode } = req.params;

        if (!shortCode) {
            res.status(400).send({ error: "Short code is required" });
            return;
        }
        try {
            const originalUrl: any = await this.urlService.retrieveShortenedUrl(shortCode);

            if (!originalUrl) {
                res.status(404).send({ error: "URL not found" });
                return;
            }

            res.send({ url: originalUrl });
        } catch (error) {
            console.error("Error in getUrl:", error);
            res.status(500).send({ error: "Internal server error" });
        }
    };
}
