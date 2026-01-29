import { Request, Response, Router } from "express";
import type { WorkspaceInfo } from "types";
import fs from "fs-extra";
import path from "path";

import { checkNameExists } from "./_nameExist";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    try {
        const reqBody: WorkspaceInfo = req.body;
        let targetPath = reqBody.path;

        if (targetPath) {
            const dir = path.dirname(targetPath);
            const specificName = path.basename(targetPath);
            targetPath = path.join(dir, specificName.replace(/\s+/g, "-"));
        }

        if (!targetPath) {
            return res.status(400).json({ error: "Path is required" });
        }

        const nameToCheck = reqBody.name || path.basename(targetPath);
        if (await checkNameExists(nameToCheck)) {
             return res.status(409).json({ error: `Workspace with name "${nameToCheck}" already exists.` });
        }

        await fs.ensureDir(targetPath);
        const packageJson: any = {
            name:       (reqBody.name || path.basename(targetPath)).toLowerCase().replace(/\s+/g, "-"),
            version:    "1.0.0",
            description:     reqBody.description     || "",
            fontawesomeIcon: reqBody.fontawesomeIcon || "fa fa-cube text-blue-500",
            scripts: {
                dev:   reqBody.devCommand   || "",
                start: reqBody.startCommand || undefined,
                stop:  reqBody.stopCommand  || undefined,
                build: reqBody.buildCommand || undefined,
                clean: reqBody.cleanCommand || undefined,
                lint:  reqBody.lintCommand  || undefined,
                test:  reqBody.testCommand  || undefined
            }
        };

        Object.keys(packageJson.scripts).forEach(key => 
            packageJson.scripts[key] === undefined && delete packageJson.scripts[key]
        );
        await fs.writeJSON(path.join(targetPath, "package.json"), packageJson, { spaces: 2 });

        res.json({ message: "Workspace created successfully", path: targetPath });

    } catch (e: any) {
        console.error("Error creating workspace:", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
