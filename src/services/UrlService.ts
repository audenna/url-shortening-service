import { UtilService } from '../utils/utils';
import { config } from "../config/config";
import { DataService, IStorageData } from './DataService';
import { StorageConfig } from "./RepositoryFactory";

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

    handleUrlShortening = async (originalUrl: string): Promise<string> => {
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

            return JSON.stringify({ shortenedURL });

        } catch (e) {
            throw Error('An internal server occurred');
        }
    }

    retrieveShortenedUrl = async (shortCode: string): Promise<any> => {
        return await this.dataService.getData(shortCode);
    }
}
