import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const turboJsonPath = path.join(ROOT, 'turbo.json');
        const exists = fs.existsSync(turboJsonPath);
        res.json({ exists });
    } catch (error) {
        console.error("Error checking turbo.json:", error);
        res.status(500).json({ error: "Internal server error", exists: false });
    }
});

export default router;
