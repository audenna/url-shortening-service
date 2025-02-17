import { RepositoryFactory } from "../../src/services/RepositoryFactory";
import { IDataRepository } from "../../src/repositories/IDataRepository";
import { InMemoryRepository } from "../../src/repositories/InMemoryRepository";
import { RedisClientRepository } from "../../src/repositories/RedisClientRepository";
import { IStorageConfig } from "../../src/types";

describe("RepositoryFactory", () => {
    it('should create an InMemoryRepository when config.type is memory', () => {
        const config: IStorageConfig = { type: 'memory' };
        const repository: IDataRepository = RepositoryFactory.createRepository(config);
        expect(repository).toBeInstanceOf(InMemoryRepository);
    });

    it('should create a RedisClientRepository when config.type is redis', () => {
        const config: IStorageConfig = { type: 'redis' };
        const repository: IDataRepository = RepositoryFactory.createRepository(config);
        expect(repository).toBeInstanceOf(RedisClientRepository);
    });

    it('should throw an error when no type is set', () => {
        const config: IStorageConfig = { type: '' };
        expect((): IDataRepository => RepositoryFactory.createRepository(config)).toThrow();
    });
});
