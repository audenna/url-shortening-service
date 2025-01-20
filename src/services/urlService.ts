import { UrlStorage } from "../models/urlStorage";
import { UtilService } from '../utils/utils';
import { config } from "../config/config";

export class UrlService {
    private urlStorage: UrlStorage;
    private utilService: UtilService;

    constructor() {
        this.urlStorage = new UrlStorage();
        this.utilService = new UtilService();
    }

    handleUrlShortening = (url: string): string => {
        // Ensure that the URL is a valid one
        if (!this.utilService.validateUrlString(url)) throw Error('Invalid Url entered');
        try {
            const shortCode: string = this.utilService.generateShortCode();
            const shortenedURL = `${config.baseUrl}/${shortCode}`;

            // Save the mapping to the In-memory storage
            this.urlStorage.saveMapping(shortCode, url);

            return JSON.stringify({ shortenedURL });

        } catch (e) {
            throw Error('An internal server occurred');
        }
    }

    retrieveShortenedUrl = (shortCode: string): any => {
        return this.urlStorage.getOriginalUrl(shortCode);
    }
}
