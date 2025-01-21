import { Request, Response } from "express";
import { Socket } from "socket.io";
import { UrlService } from "../services/UrlService";
import { UtilService } from '../utils/utils';

export class UrlController {
    private static instance: UrlController | null = null;
    private urlService: UrlService;
    private socketClient: Socket | null;
    private utilService: UtilService;

    constructor() {
        this.urlService = new UrlService();
        this.socketClient = null;
        this.utilService = new UtilService();
    }

    /**
     * Here, I implemented a Singleton pattern to enable the Controller instance be instantiated only once at runtime.
     * This prevents the server from creating multiple instances of this controller as it holds the Realtime notification
     *
     */
    static getInstance(): UrlController {
        if (!UrlController.instance) {
            UrlController.instance = new UrlController();
        }

        return UrlController.instance;
    }

    setSocketClient(client: Socket): void {
        try {
            this.socketClient = client;
            console.log('WebSocket client set to:', this.socketClient);  // Log the client

        } catch (error) {
            console.error("Error in setSocketClient:", error);
        }
    }

    removeSocketClient(): void {
        this.socketClient = null;
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

            // extract the url from the body of the request
            const { url } = req.body;

            // handle the storage of the url
            await this.urlService.handleUrlShortening(url, this.socketClient);

            res.status(202).send({ message: "You should receive a Shortened URL via WebSocket shortly" });

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
