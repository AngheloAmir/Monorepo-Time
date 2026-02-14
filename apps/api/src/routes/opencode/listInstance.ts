import { Request, Response, Router } from "express";
import { opencodeInstances } from "./_core";

const router = Router();
router.get("/", (req: Request, res: Response) => {
    const instances = Array.from(opencodeInstances.values()).map(instance => ({
        id: instance.id,
        url: instance.url,
        port: instance.port,
        name: instance.name,

        // 'detached' means we lost the handle but it might still be running
        status: instance.server ? "active" : "detached",
        createdAt: instance.createdAt,
        lastSessionId: instance.lastSessionId
    }));
    res.json({ instances });
});

export default router;
