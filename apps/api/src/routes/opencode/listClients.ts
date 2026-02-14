import { Request, Response, Router } from "express";
import { opencodeInstances } from "./_core";

const router = Router();
router.get("/", (req: Request, res: Response) => {
    const clients = Array.from(opencodeInstances.values()).map(instance => ({
        ...instance,
    }));
    res.json({ clients });
});

export default router;
