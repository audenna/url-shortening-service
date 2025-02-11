import { IDataRepository } from "./IDataRepository";
import { IStorageData } from "../types";
import { createClient } from "redis";

export class RedisClientRepository implements IDataRepository {
    private redisClient: any;

    constructor() {
        this.initialize();
    }

    private initialize() {
        this.redisClient = createClient({
            url: "redis://localhost:6379",
        });

        this.redisClient.on("error", (err: any) => console.error("Redis Error:", err));

        (async () => {
            await this.redisClient.connect();
            console.log("Redis connected!");
        })();
    }

    public save = async (data: IStorageData): Promise<void> => {
        console.log('Received data for processing', data)
        await this.redisClient.set(data.shortCode, data.originalUrl);
    }

    public findById = async (id: string): Promise<string | null> => {
        return this.redisClient.get(id);
    }
}
