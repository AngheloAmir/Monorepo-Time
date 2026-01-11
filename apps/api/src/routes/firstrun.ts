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
            // Create the file with default content from scaffold if it doesn't exist
            // This marks that the app has run at least once (after this request)
            try {
                const scaffoldPath = path.join(__dirname, 'scaffold', 'monorepotime.json');
                const defaultContent = await fs.readJson(scaffoldPath);
                fs.writeJsonSync(monorepoTimePath, defaultContent, { spaces: 4 });
            } catch (err) {
                 console.error("Error reading scaffold file for firstrun:", err);
                 // Fallback to empty if scaffold fails
                 fs.writeJsonSync(monorepoTimePath, { notes: "", crudtest: [] }, { spaces: 4 });
            }
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
