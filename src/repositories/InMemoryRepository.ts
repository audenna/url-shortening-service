import { IDataRepository } from "./IDataRepository";
import { IStorageData } from "../types";

export class InMemoryRepository implements IDataRepository {
    private store: Map<string, any>;

    constructor() {
        this.store = new Map();
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
