import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        let isExist         = true;
        const turboJsonPath = path.join(ROOT, 'turbo.json');
        const turboExists   = fs.existsSync(turboJsonPath);
        if (!turboExists) {
            isExist = false;
        }
        
        const monorepoJsonPath = path.join(ROOT, 'monorepotime.json');
        const monorepoExists   = fs.existsSync(monorepoJsonPath);
        if (!monorepoExists) {
            isExist = false;
        }

        res.json({ exists: isExist });
    } catch (error) {
        console.error("Error checking turbo.json:", error);
        res.status(500).json({ error: "Internal server error", exists: false });
    }
});

export default router;
