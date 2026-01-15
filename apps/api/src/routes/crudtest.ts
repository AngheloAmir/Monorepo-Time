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

        const data = await fs.readJson(monorepoTimePath);
        data.crudtest = crudtest;
        await fs.writeJson(monorepoTimePath, data, { spaces: 4 });
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving crudtest:", error);
        res.status(500).json({ error: "Failed to save crudtest" });
    }
});

export default router;
