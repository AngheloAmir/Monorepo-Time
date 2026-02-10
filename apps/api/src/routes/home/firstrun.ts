import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "../utils/rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const turboJsonPath = path.join(ROOT, "turbo.json");
        const exists = fs.existsSync(turboJsonPath);

        res.json({ isFirstTime: !exists });
    } catch (error) {
        console.error("First run check error:", error);
        res.status(500).json({ 
            error: "Failed to check first run status", 
            details: error instanceof Error ? error.message : String(error) 
        });
    }
});

export default router;
