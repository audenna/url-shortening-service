import { Request, Response } from "express";
import { UrlService } from "../services/UrlService";
import { Socket } from "socket.io";
import { UtilService } from "../utils/utils";
import { DataService } from "../services/DataService";
import { config } from "../config/config";
import { IUrlPayload } from "../types";

export class UrlController {
    private static instance: UrlController | null = null;
    private urlService: UrlService;
    private utilService: UtilService = new UtilService();
    private dataService: DataService = new DataService({ type: config.storageType });

    constructor() {
        this.urlService = new UrlService(this.utilService, this.dataService);
    }

    /**
     * Here, I implemented a Singleton pattern to enable the Controller instance be instantiated only once at runtime.
     * This prevents the server from creating multiple instances of this controller as it holds the Realtime notification usage
     *
     */
    public static getInstance(): UrlController {
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
    public postUrl = async (req: Request, res: Response): Promise<void> => {
        try {

            // Extract the url from the body of the request
            const { url, customName } = req.body;

            // Ensure there’s a connected WebSocket for this client
            const socket: Socket | null = (req as any).activeSocket || null || undefined;
            if (!socket) {
                res.status(400).json({ error: "No active WebSocket connection found for client." });
                return;
            }

            const payload: IUrlPayload = {
                originalUrl: url,
                customName
            };

            // handle the storage of the url
            await this.urlService.handleUrlShortening(payload, socket);

            res.status(202).send({ message: "You should receive a Shortened URL via a WebSocket connection shortly" });

        } catch (error) {
            console.error("Error in postUrl:", error);
            res.status(500).send({ error: "Internal server error" });
        }
    };

    public getUrl = async (req: Request, res: Response): Promise<void> => {
        try {

            const { shortCode } = req.params;

            if (!shortCode) {
                res.status(400).send({ error: "Short code is required" });
                return;
            }

            const originalUrl: string | null = await this.urlService.retrieveShortenedUrl(shortCode);

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
