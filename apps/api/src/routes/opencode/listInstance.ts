import { Request, Response, Router } from "express";
import { opencodeInstances } from "./core";
import { clean } from "./_helper";

const router = Router();
router.get("/", async (req: Request, res: Response) => {
    await clean();
    
    const instances = Array.from(opencodeInstances.values()).map(instance => ({
       ...instance
    }));
    res.json({ instances });
});

export default router;
