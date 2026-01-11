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
        res.json({ notes: data.notes || "" });
    } catch (error) {
        console.error("Error reading notes:", error);
        res.status(500).json({ error: "Failed to read notes" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { notes } = req.body;
        if (typeof notes !== 'string') {
            res.status(400).json({ error: "Invalid notes format" });
            return;
        }

        await ensureFile();
        const data = await fs.readJson(monorepoTimePath);
        
        // Update only the notes field
        data.notes = notes;
        
        await fs.writeJson(monorepoTimePath, data, { spaces: 4 });
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving notes:", error);
        res.status(500).json({ error: "Failed to save notes" });
    }
});

export default router;
