import { UtilService } from '../utils/utils';
import { DataService } from './DataService';
import { IStorageData } from "../types";
import { Socket } from "socket.io";
import { config } from "../config/config";
import webSocketManager from "../websocket/WebSocketManager";

export class UrlService {
    constructor(private utilService: UtilService, private dataService: DataService) { }

    public handleUrlShortening = async (originalUrl: string, socket: Socket): Promise<IStorageData> => {
        try {

            const shortCode: string = this.utilService.generateShortCode();
            const shortenedURL = `${config.baseUrl}:${config.port}/${shortCode}`;

            const data: IStorageData = {
                shortCode,
                originalUrl,
            };

            // Save the mapping to the default data storage set
            await this.dataService.saveMapping(data);
            console.log(`Sending shortened URL: ${shortenedURL} to the client...`);

            // Send back the response to the correct WebSocket client
            webSocketManager.sendToClient(socket, { shortenedURL });

            return data;

        } catch (e) {
            throw Error('An internal server occurred');
        }
    }

    public retrieveShortenedUrl = async (shortCode: string): Promise<string | null> => {
        return await this.dataService.findById(shortCode);
    }
}
