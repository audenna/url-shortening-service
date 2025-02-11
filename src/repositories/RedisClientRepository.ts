import { IDataRepository } from "./IDataRepository";
import { IStorageData } from "../types";
import { createClient } from "redis";
import { config } from "../config/config";

export class RedisClientRepository implements IDataRepository {
    private redisClient: any;

    constructor() {
        this.initialize();
    }

    private initialize() {
        this.redisClient = createClient({
            url: config.redisUri,
        });

        this.redisClient.on("error", (err: any) => console.error("Redis Error:", err));

        (async () => {
            await this.redisClient.connect();
            console.log("Redis connected!");
        })();
    }

    public save = async (data: IStorageData): Promise<void> => {
        console.log(`Saving data using ${RedisClientRepository.name}`, data);
        await this.redisClient.set(data.shortCode, data.originalUrl);
    }

    public findById = async (id: string): Promise<string | null> => {
        return this.redisClient.get(id);
    }
}
