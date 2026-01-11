import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const monorepoTimePath = path.join(ROOT, "monorepotime.json");
        const exists = fs.existsSync(monorepoTimePath);

        if (!exists) {
            // Create the file with an empty list if it doesn't exist
            // This marks that the app has run at least once (after this request)
            fs.writeJsonSync(monorepoTimePath, [], { spaces: 4 });
            res.json({ isFirstTime: true });
        } else {
            res.json({ isFirstTime: false });
        }
    } catch (error) {
        console.error("First run check error:", error);
        res.status(500).json({ 
            error: "Failed to check first run status", 
            details: error instanceof Error ? error.message : String(error) 
        });
    }
});

export default router;
