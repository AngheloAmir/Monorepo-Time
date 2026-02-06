import { Router, Request, Response } from "express";
import Redis from "ioredis";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { connectionString } = req.body;
    const uri = connectionString || 'redis://localhost:6379';

    const redis = new Redis(uri);

    try {
        const timestamp = new Date().toISOString();
        await redis.rpush('check_logs', JSON.stringify({ id: Date.now(), time: timestamp }));
        const logs = await redis.lrange('check_logs', 0, -1);
        const parsedLogs = logs.map(log => JSON.parse(log));
        res.json(parsedLogs);
    } catch (err) {
        console.error(err);
        res.status(500).send("Redis error: " + err);
    } finally {
        redis.disconnect();
    }
});

export default router;
