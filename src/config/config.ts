import dotenv from "dotenv";

// Load environment variables from a `.env` file into `process.env`
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || `http://localhost`,
    environment: process.env.NODE_ENV || "development",
    storageType: process.env.STORAGE_TYPE || 'memory',
    redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
};
