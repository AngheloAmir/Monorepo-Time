import { Request, Response, Router } from "express";
import type { WorkspaceInfo } from "types";

import fs from "fs-extra";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { workspace } = req.body as { workspace: WorkspaceInfo };

        if (!workspace || !workspace.path) {
            res.status(400).json({ error: "Invalid workspace path" });
            return;
        }

        if (await fs.pathExists(workspace.path)) {
            await fs.remove(workspace.path);
        }

        res.json({ success: true, message: "Workspace deleted successfully" });
    } catch (error) {
        console.error("Error deleting workspace:", error);
        res.status(500).json({ error: "Failed to delete workspace" });
    }
});

export default router;
