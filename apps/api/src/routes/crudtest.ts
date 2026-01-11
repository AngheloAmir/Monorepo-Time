import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();
const monorepoTimePath = path.join(ROOT, "monorepotime.json");

// Ensure file exists helper
const ensureFile = async () => {
    if (!fs.existsSync(monorepoTimePath)) {
        await fs.writeJson(monorepoTimePath, { notes: "", crudtest: [] }, { spaces: 4 });
    }
};

router.get("/", async (req: Request, res: Response) => {
    try {
        await ensureFile();
        const data = await fs.readJson(monorepoTimePath);
        res.json({ crudtest: data.crudtest || [] });
    } catch (error) {
        console.error("Error reading crudtest:", error);
        res.status(500).json({ error: "Failed to read crudtest" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { crudtest } = req.body;
        if (!Array.isArray(crudtest)) {
            res.status(400).json({ error: "Invalid crudtest format, must be an array" });
            return;
        }

        await ensureFile();
        const data = await fs.readJson(monorepoTimePath);
        
        // Update only the crudtest field
        data.crudtest = crudtest;
        
        await fs.writeJson(monorepoTimePath, data, { spaces: 4 });
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving crudtest:", error);
        res.status(500).json({ error: "Failed to save crudtest" });
    }
});

export default router;
