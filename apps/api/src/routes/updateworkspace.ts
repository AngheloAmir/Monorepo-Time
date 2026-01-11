import { Request, Response, Router } from "express";
import type { WorkspaceInfo } from 'types';
import fs from 'fs-extra';
import path from 'path';

import { checkNameExists } from "./_nameExist";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const workspace: WorkspaceInfo = req.body; 
        
        if (!workspace || !workspace.path) {
            res.status(400).send({ error: "Invalid workspace data" });
            return;
        }

        if (workspace.name && await checkNameExists(workspace.name, workspace.path)) {
             res.status(409).send({ error: `Workspace with name "${workspace.name}" already exists.` });
             return;
        }

        const packageJsonPath = path.join(workspace.path, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            res.status(404).send({ error: "package.json not found in workspace path" });
            return;
        } 

        const packageJson = await fs.readJson(packageJsonPath);
        if (workspace.name) packageJson.name = workspace.name;
        if (workspace.description   != typeof null) packageJson.description = workspace.description;
        if (workspace.devCommand    != typeof null) packageJson.scripts.dev = workspace.devCommand;
        if (workspace.startCommand  != typeof null) packageJson.scripts.start = workspace.startCommand;
        if (workspace.buildCommand  != typeof null) packageJson.scripts.build = workspace.buildCommand;
        if (workspace.testCommand   != typeof null) packageJson.scripts.test = workspace.testCommand;
        if (workspace.lintCommand   != typeof null) packageJson.scripts.lint = workspace.lintCommand;
        if (workspace.stopCommand   != typeof null) packageJson.scripts.stop  = workspace.stopCommand;
        if (workspace.cleanCommand  != typeof null) packageJson.scripts.clean = workspace.cleanCommand;

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        res.send({ success: true, message: "Workspace updated successfully" });
    } catch (error: any) {
        console.error("Update workspace error:", error);
        res.status(500).send({ error: error.message });
    }
});

export default router;
