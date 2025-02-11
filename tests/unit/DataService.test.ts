import { DataService } from "../../src/services/DataService";
import { RepositoryFactory } from "../../src/services/RepositoryFactory";
import { IDataRepository } from "../../src/repositories/IDataRepository";
import { IStorageConfig, IStorageData } from "../../src/types";
import { config } from '../../src/config/config';

const mockedIDataRepository: jest.Mocked<IDataRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
};

jest.mock("../../src/services/RepositoryFactory", () => ({
    RepositoryFactory: {
        createRepository: jest.fn((): jest.Mocked<IDataRepository> => mockedIDataRepository)
    }
}));

describe("DataService", () => {
    let dataService: DataService;
    const mockConfig: IStorageConfig = {
        type: config.storageType
    };

    const data: IStorageData = {
        shortCode: '1234567890',
        originalUrl: 'www.google.com',
    }

    beforeEach(() => {
        dataService = new DataService(mockConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create the correct repository using RepositoryFactory", () => {
        expect(RepositoryFactory.createRepository).toHaveBeenCalledWith(mockConfig);
    });

    describe("saveMapping", () => {
        it('should create a new record successfully', async (): Promise<void> => {
            await dataService.saveMapping(data);

            expect(mockedIDataRepository.save).toHaveBeenCalledWith(data);
        });

        it('should throw an error if saving fails', async (): Promise<void> => {
            mockedIDataRepository.save.mockRejectedValue(new Error("Database error"));

            await expect(dataService.saveMapping(data)).rejects.toThrow('Failed to save mapping');
        });
    });
});
