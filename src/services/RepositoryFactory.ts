import { IDataRepository } from "../repositories/IDataRepository";
import { InMemoryRepository } from "../repositories/InMemoryRepository";
import { RedisClientRepository } from "../repositories/RedisClientRepository";
import { IStorageConfig } from "../types";
/**
 *
 * This class helps us to dynamically use the default memory storage type already set in the .env.
 * If there's no default type configured, it automatically sets the memory type as default.
 */
export class RepositoryFactory {
    static createRepository(config: IStorageConfig): IDataRepository {
        if (config.type === "memory") {
            return new InMemoryRepository();
        }

        if (config.type === 'redis') {
            return new RedisClientRepository();
        }

        throw new Error("Invalid storage type");
    }
}
