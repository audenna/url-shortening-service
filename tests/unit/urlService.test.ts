import { UrlService } from "../../src/services/UrlService";
import { DataService, IStorageData } from '../../src/services/DataService';
import { UtilService } from "../../src/utils/utils";
import { Socket } from "socket.io";
import { config } from "../../src/config/config";

// Set mocks for external dependencies
jest.mock("../../src/services/DataService");
jest.mock("../../src/utils/utils");

const shortCode: string = 'abc123';

describe('UrlService', () => {
    let urlService: UrlService;
    let mockedDataService: jest.Mocked<DataService>;
    let mockedUtilService: jest.Mocked<UtilService>;
    let mockedSocket: jest.Mocked<Socket>;

    // Store original console methods
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    // This acts like the constructor of the UrlService class
    beforeEach(() => {
        // Mock UtilService
        mockedUtilService = new UtilService() as jest.Mocked<UtilService>;
        mockedUtilService.generateShortCode.mockReturnValue(shortCode);

        // Mock DataService
        mockedDataService = new DataService({ type: config.storageType }) as jest.Mocked<DataService>;
        mockedDataService.saveMapping.mockResolvedValue(undefined);
        mockedDataService.getData.mockResolvedValue({
            shortCode: shortCode,
            originalUrl: config.baseUrl,
        });

        // Mock Socket.IO client
        mockedSocket = {
            emit: jest.fn(),
        } as unknown as jest.Mocked<Socket>;

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
        const originalUrl: string = config.baseUrl;

        const result: string = await urlService.handleUrlShortening(originalUrl, mockedSocket);

        expect(result).toEqual(JSON.stringify({ shortenedURL: `${originalUrl}/${shortCode}` }));

        expect(mockedUtilService.generateShortCode).toHaveBeenCalledTimes(1);

        const data: IStorageData = {
            shortCode,
            originalUrl,
        }

        expect(mockedDataService.saveMapping).toHaveBeenCalledWith(data);

        expect(mockedSocket.emit).toHaveBeenCalledWith("shortenedURL", `${originalUrl}/${shortCode}`);
    });

    it('should return a stored original URL when retrieving by short code', async () => {
        const result = await urlService.retrieveShortenedUrl(shortCode);
        expect(result).toEqual({
            shortCode,
            originalUrl: config.baseUrl,
        });
    });
});

