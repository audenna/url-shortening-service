import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';

const redis = new Redis();
const MAX_LIMIT = 5;
const MAX_TIME_OUT = 60;

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip: string|undefined = req.ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();
    console.log(`IP: ${ip}`);
    if (!ip) {
        res.status(400).json({ message: "Unable to retrieve Client's IP" });
        return;
    }

    try {

        const requests: number = await redis.incr(ip);
        if ((requests === 1)) {
            await redis.expire(ip, MAX_TIME_OUT);
        }

        if (requests > MAX_LIMIT) {
            res.status(429).json({ message: "Too many requests. Please try again later" });
            return;
        }

        next();

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error occurred" });
        return;
    }
}
