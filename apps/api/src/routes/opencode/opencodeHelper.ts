import { Router } from "express";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { ROOT }  from "../utils/rootPath";

const router = Router();

router.get("/check", async (req, res) => {
    try {
        const packageJsonPath = path.join(ROOT, "package.json");
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            const devDeps     = packageJson.devDependencies || {};
            const deps        = packageJson.dependencies || {};

            let isGlobal = false;
            try {
                await execa('opencode', ['--version']);
                isGlobal = true;
            } catch (error) {}

            if ( devDeps["opencode-ai"] || deps["opencode-ai"] || isGlobal ) {
                res.json({ status: "local" });
                return;
            }
        }
        
        res.json({ status: "none" });
    } catch (error: any) {
        console.error("Error checking opencode:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/install", async (req, res) => {
    try {
        await execa('npm', ['install', '-g', 'opencode-ai']);
        res.json({ success: true });

    } catch (error: any) {
        console.error("Error installing opencode:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
