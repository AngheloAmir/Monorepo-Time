import { Request, Response, Router } from "express";
import type { WorkspaceInfo } from 'types';
import fs from 'fs-extra';
import path from 'path';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const workspace: WorkspaceInfo = req.body; 
        
        if (!workspace || !workspace.path) {
            res.status(400).send({ error: "Invalid workspace data" });
            return;
        }

        const packageJsonPath = path.join(workspace.path, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            res.status(404).send({ error: "package.json not found in workspace path" });
            return;
        }

        const packageJson = await fs.readJson(packageJsonPath);
        if (workspace.name) packageJson.name = workspace.name;
        if (workspace.description) packageJson.description = workspace.description;
        if (workspace.devCommand)   packageJson.scripts.dev   = workspace.devCommand;
        if (workspace.startCommand) packageJson.scripts.start = workspace.startCommand;
        if (workspace.buildCommand) packageJson.scripts.build = workspace.buildCommand;
        if (workspace.testCommand)  packageJson.scripts.test  = workspace.testCommand;
        if (workspace.lintCommand)  packageJson.scripts.lint  = workspace.lintCommand;
        
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        res.send({ success: true, message: "Workspace updated successfully" });
    } catch (error: any) {
        console.error("Update workspace error:", error);
        res.status(500).send({ error: error.message });
    }
});

export default router;
