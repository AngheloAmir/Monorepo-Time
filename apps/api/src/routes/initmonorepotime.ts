
import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const sourcePath = path.join(__dirname, 'scaffold', 'monorepotime.json');
        const destPath = path.join(ROOT, "monorepotime.json");

        if (fs.existsSync(destPath)) {
             res.status(400).json({ success: false, message: "monorepotime.json already exists" });
             return;
        }

        if (!fs.existsSync(sourcePath)) {
            // Fallback content if scaffold is missing, though it should exist
            await fs.writeJson(destPath, { notes: "", crudtest: [] }, { spaces: 4 });
             res.json({ success: true, message: "Created monorepotime.json with default content (scaffold missing)" });
             return;
        }

        await fs.copy(sourcePath, destPath);
        res.json({ success: true, message: "Successfully initialized monorepotime.json" });

    } catch (error) {
        console.error("Error initializing monorepotime.json:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to initialize monorepotime.json",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
