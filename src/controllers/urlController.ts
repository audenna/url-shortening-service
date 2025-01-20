import { Request, Response } from "express";
import { UrlService } from "../services/urlService";
import { Socket } from "socket.io";

export class UrlController {
    private static instance: UrlController | null = null;
    private urlService: UrlService;
    private socketClient: Socket | null;

    constructor() {
        this.urlService = new UrlService();
        this.socketClient = null;
    }

    /**
     * Here, I implemented a Singleton pattern to enable the Controller instance be instantiated only once at runtime.
     * This prevents the server from creating multiple instances of this controller as it holds the Realtime notification
     *
     */
    public static getInstance(): UrlController {
        if (!UrlController.instance) {
            UrlController.instance = new UrlController();
        }

        return UrlController.instance;
    }

    public setSocketClient(client: Socket): void {
        try {
            this.socketClient = client;
            console.log('WebSocket client set to:', this.socketClient);  // Log the client

        } catch (error) {
            console.error("Error in setSocketClient:", error);
        }
    }

    public removeSocketClient(): void {
        this.socketClient = null;
    }

    /**
     * This handles the incoming request for Url shortening
     *  It accepts and validates the Url before processing it
     *
     * @param req
     * @param res
     */
    postUrl = (req: Request, res: Response): void => {
        // console.log("The connected client is: ", this.socketClient);
        try {
            const { url } = req.body;

            if (!url) {
                res.status(400).send({ error: "Kindly enter a valid URL" });
                return;
            }

            const shortenedURL: string = this.urlService.handleUrlShortening(url);
            if (! shortenedURL) {
                res.status(400).send({ error: "Kindly check that you have entered an invalid URL" });
            }

            console.log(`Sending shortened URL: ${shortenedURL} to the client...`);

            // Send the shortened URL via Socket.IO if the client is connected
            if (this.socketClient) {
                this.socketClient.emit("shortenedURL", shortenedURL);
                console.log(`A shortened URL: ${shortenedURL} has been sent to the client`);
            } else {
                console.warn("No Socket.IO client connected");
            }

            res.status(202).send({ message: "You should receive a Shortened URL via WebSocket shortly" });
        } catch (error) {
            console.error("Error in postUrl:", error);
            res.status(500).send({ error: "Internal server error" });
        }
    };

    getUrl = (req: Request, res: Response): void => {
        const { shortCode } = req.params;

        if (!shortCode) {
            res.status(400).send({ error: "Short code is required" });
            return;
        }
        try {
            const originalUrl: any = this.urlService.retrieveShortenedUrl(shortCode);

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
