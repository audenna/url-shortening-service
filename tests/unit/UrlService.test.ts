import { UrlService } from "../../src/services/UrlService";
import { UtilService } from "../../src/utils/utils";
import { DataService } from "../../src/services/DataService";
import { Socket } from "socket.io";
import webSocketManager from "../../src/websocket/WebSocketManager";
import { config } from "../../src/config/config";
import { IStorageConfig, IStorageData, IUrlPayload } from "../../src/types";

jest.mock('../../src/utils/utils');
jest.mock('../../src/services/DataService');
jest.mock('../../src/websocket/WebSocketManager');
jest.mock('socket.io');

describe("UrlService", () => {
    let urlService: UrlService;
    let mockUtilService: jest.Mocked<UtilService>;
    let mockDataService: jest.Mocked<DataService>;
    let mockSocket: jest.Mocked<Socket>;

    const mockedConfig: IStorageConfig = {
        type: config.storageType
    }

    const mockShortCode: string = '234567891';
    const originalUrl: string = 'www.google.com';
    const mockShortenedResult: IStorageData = {
        shortCode: mockShortCode,
        originalUrl
    };

    beforeEach(() => {
        mockUtilService = new UtilService() as jest.Mocked<UtilService>;
        mockDataService = new DataService(mockedConfig) as jest.Mocked<DataService>;
        mockSocket = { emit: jest.fn() } as any;

        urlService = new UrlService(mockUtilService, mockDataService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe("handleUrlShortening", () => {
        it('should generate a short URL with a customName and send it via WebSocket', async () => {
            mockUtilService.generateShortCode.mockReturnValue(mockShortCode);
            mockDataService.saveMapping.mockResolvedValue(undefined);

            const payload: IUrlPayload = {
                originalUrl,
                customName: '1234567890'
            };

            const result: IStorageData = await urlService.handleUrlShortening(payload, mockSocket);
            const shortenedURL = `${config.baseUrl}:${config.port}/${payload.customName}`;

            expect(result).toEqual({ originalUrl, shortCode: payload.customName });
            expect(jest.spyOn(mockUtilService, 'generateShortCode')).not.toHaveBeenCalled();
            expect(jest.spyOn(webSocketManager, 'sendToClient')).toHaveBeenCalledWith(mockSocket, { shortenedURL });
        });

        it('should generate a short URL without a customName and send it via WebSocket', async () => {
            mockUtilService.generateShortCode.mockReturnValue(mockShortCode);
            mockDataService.saveMapping.mockResolvedValue(undefined);

            const result: IStorageData = await urlService.handleUrlShortening({ originalUrl }, mockSocket);
            const shortenedURL = `${config.baseUrl}:${config.port}/${mockShortCode}`;

            expect(result).toEqual(mockShortenedResult);
            expect(jest.spyOn(mockUtilService, 'generateShortCode')).toHaveBeenCalled();
            expect(jest.spyOn(webSocketManager, 'sendToClient')).toHaveBeenCalledWith(mockSocket, { shortenedURL });
        });

        it('should throw an internal server error when URL is not created', async () => {
            mockDataService.saveMapping.mockRejectedValue(new Error('Database error'));

            await expect(urlService.handleUrlShortening({ originalUrl }, mockSocket)).rejects.toThrow('An internal server occurred');
        });
    });

    describe("retrieveShortenedUrl", () => {
        it('should return original URL if short code was found', async () => {
            mockDataService.findById.mockResolvedValue(originalUrl);

            const result: string | null = await urlService.retrieveShortenedUrl(mockShortCode);

            expect(result).toEqual(originalUrl);
            expect(jest.spyOn(mockDataService, 'findById')).toHaveBeenCalledTimes(1);
        });

        it('should return null if not shortcode was found', async () => {
            mockDataService.findById.mockResolvedValue(null);

            const result: string | null = await urlService.retrieveShortenedUrl(mockShortCode);

            expect(result).toBeFalsy();
        });
    });
});
