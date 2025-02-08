import { RepositoryFactory } from "./RepositoryFactory";
import { IDataRepository } from "../repositories/IDataRepository";
import { IStorageData, StorageConfig } from "../types";

export class DataService {
    private repository: IDataRepository;

    constructor(protected config: StorageConfig) {
        this.repository = RepositoryFactory.createRepository(config);
    }

    async saveMapping(data: IStorageData): Promise<void> {
        console.log("Saving User's shortened URL", data)
        try {
            await this.repository.save(data);
        } catch (error) {
            console.error("Error saving mapping:", error);
            throw new Error("Failed to save mapping");
        }
    }

    async findById(id: string): Promise<string | null> {
        return await this.repository.findById(id);
    }
}
