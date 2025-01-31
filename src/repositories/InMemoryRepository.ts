import { IStorageData } from "../services/DataService";
import { IDataRepository } from "./IDataRepository";

export class InMemoryRepository implements IDataRepository {
    private store: Map<string, any> = new Map();

    constructor() {
        this.store = new Map<string, any>();
    }

    async save(data: IStorageData): Promise<void> {
        console.log('Received data for processing', data)
        this.store.set(data.shortCode, data.originalUrl);
    }

    async find(id: string): Promise<any> {
        return this.store.get(id);
    }

    async findAll(): Promise<any[]> {
        return Array.from(this.store.entries());
    }
}
