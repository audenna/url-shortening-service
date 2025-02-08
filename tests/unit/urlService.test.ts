import { UrlService } from "../../src/services/UrlService";
import { DataService } from '../../src/services/DataService';
import { UtilService } from "../../src/utils/utils";
import { Socket } from "socket.io";
import { config } from "../../src/config/config";
import { IStorageData } from "../../src/types";

jest.mock("../../src/services/DataService");
jest.mock("../../src/utils/utils");

describe('UrlService', () => {
    let urlService: UrlService;

    let mockedDataService: jest.Mocked<DataService>;
    let mockedUtilService: jest.Mocked<UtilService>;
    let mockedSocket: jest.Mocked<Socket>;

    // Store original console methods
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    const shortCode: string = 'abc123';
    const payload: IStorageData = {
        shortCode,
        originalUrl: `${config.baseUrl}:${config.port}`
    };

    // This acts like the constructor of the UrlService class
    beforeEach(() => {
        // Mock UtilService
        mockedUtilService = new UtilService() as jest.Mocked<UtilService>;
        mockedUtilService.generateShortCode.mockReturnValue(shortCode);

        // Mock DataService
        mockedDataService = new DataService({ type: config.storageType }) as jest.Mocked<DataService>;
        mockedDataService.saveMapping.mockResolvedValue(undefined);
        mockedDataService.getData.mockResolvedValue(payload);

        // Mock Socket.IO client
        mockedSocket = { emit: jest.fn() } as unknown as jest.Mocked<Socket>;

        // Inject mocks into UrlService
        urlService = new UrlService();
        (urlService as any).utilService = mockedUtilService;
        (urlService as any).dataService = mockedDataService;

        // Mock console methods to silence logs during tests
        console.log = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        // Restore original console methods after tests
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
    });

    it("should generate a shortened URL successfully and send to connected socket", async () => {
        const originalUrl: string = `${config.baseUrl}:${config.port}`;
        const result: IStorageData = await urlService.handleUrlShortening(originalUrl, mockedSocket);

        expect(result).toEqual(payload);
        expect(mockedUtilService.generateShortCode).toHaveBeenCalledTimes(1);
        expect(mockedDataService.saveMapping).toHaveBeenCalledWith(payload);

        // Test that the server emitted the required message to the client
        const shortenedURL = `${originalUrl}/${shortCode}`;
        expect(mockedSocket.emit).toHaveBeenCalledWith("shortenedURL", { shortenedURL });
    });

    it('should return a stored original URL when retrieving by short code', async () => {
        const result = await urlService.retrieveShortenedUrl(shortCode);
        expect(result).toEqual(payload);
    });

    it("should handle data storage failure", async () => {
        mockedDataService.saveMapping.mockRejectedValue(new Error("DB Error"));

        await expect(urlService.handleUrlShortening("https://example.com", mockedSocket))
            .rejects.toThrow("An internal server occurred");

        expect(mockedSocket.emit).not.toHaveBeenCalled();
    });
});

