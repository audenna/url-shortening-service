import { UtilService } from '../utils/utils';
import { config } from "../config/config";
import { DataService } from './DataService';
import { StorageConfig } from "./RepositoryFactory";
import { IStorageData } from "../types";
import webSocketManager from "../websocket/WebSocketManager";
import { Socket } from "socket.io";

export class UrlService {
    private dataService: DataService;
    private utilService: UtilService;

    constructor() {
        this.dataService = new DataService(this.getDefaultStorageType());
        this.utilService = new UtilService();
    }

    private getDefaultStorageType():  StorageConfig {
        return {
            type: config.storageType
        };
    }

    handleUrlShortening = async (originalUrl: string, socket: Socket): Promise<IStorageData> => {
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

    retrieveShortenedUrl = async (shortCode: string): Promise<IStorageData> => {
        return await this.dataService.getData(shortCode);
    }
}
