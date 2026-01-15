import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();
const monorepoTimePath = path.join(ROOT, "monorepotime.json");

router.get("/", async (req: Request, res: Response) => {
    if (!fs.existsSync(monorepoTimePath)) {
        res.status(404).json({ error: "monorepotime.json not found" });
        return;
    }

    try {
        const data = await fs.readJson(monorepoTimePath);
        res.json({ notes: data.notes || "" });
    } catch (error) {
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

        const data = await fs.readJson(monorepoTimePath);
        data.notes = notes;
        await fs.writeJson(monorepoTimePath, data, { spaces: 4 });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to save notes" });
    }
});

export default router;
