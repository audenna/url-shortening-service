import { UtilService } from '../utils/utils';
import { config } from "../config/config";
import { DataService, IStorageData } from './DataService';
import { StorageConfig } from "./RepositoryFactory";
import { Socket } from "socket.io";

export class UrlService {
    private dataService: DataService;
    private utilService: UtilService;

    constructor() {
        this.dataService = new DataService(this.getDefaultStorageType());
        this.utilService = new UtilService();
    }

    private getDefaultStorageType = (): StorageConfig => {
        return {
            type: config.storageType
        };
    }

    handleUrlShortening = async (originalUrl: string, socketClient: Socket | null): Promise<string> => {
        // Ensure that the URL is a valid one
        if (!this.utilService.validateUrlString(originalUrl)) {
            throw Error('Invalid Url entered');
        }
        try {

            const shortCode: string = this.utilService.generateShortCode();
            const shortenedURL = `${config.baseUrl}/${shortCode}`;

            const data: IStorageData = {
                shortCode,
                originalUrl,
            }

            // Save the mapping to the default data storage set
            await this.dataService.saveMapping(data);
            console.log(`Sending shortened URL: ${shortenedURL} to the client...`);

            // Send the shortened URL via Socket.IO if the client is connected
            if (socketClient) {
                socketClient.emit("shortenedURL", shortenedURL);
                console.log(`A shortened URL: ${shortenedURL} has been sent to the client`);
            } else {
                console.warn("No Socket.IO client connected");
            }

            return JSON.stringify({ shortenedURL });

        } catch (e) {
            throw Error('An internal server occurred');
        }
    }

    retrieveShortenedUrl = async (shortCode: string): Promise<any> => {
        return await this.dataService.getData(shortCode);
    }
}
