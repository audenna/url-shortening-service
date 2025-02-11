import { IDataRepository } from "./IDataRepository";
import { IStorageData } from "../types";

export class InMemoryRepository implements IDataRepository {
    private store: Map<string, any>;

    constructor() {
        this.store = new Map();
    }

    public save = async (data: IStorageData): Promise<void> => {
        console.log('Received data for processing', data)
        this.store.set(data.shortCode, data.originalUrl);
    }

    public findById = async (id: string): Promise<string | null> => {
        return this.store.get(id);
    }
}
