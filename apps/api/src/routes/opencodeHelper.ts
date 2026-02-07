import { Router } from "express";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { ROOT }  from "./rootPath";

const router = Router();

router.get("/check", async (req, res) => {
    try {
        const packageJsonPath = path.join(ROOT, "package.json");
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            const devDeps     = packageJson.devDependencies || {};

            if ( devDeps["opencode-ai"] ) {
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
        // 1. Install opencode-ai
        await execa('npm', ['install', '-D', 'opencode-ai'], { cwd: ROOT });

        // 2. Add script to package.json
        const packageJsonPath = path.join(ROOT, "package.json");
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts.opencode = "opencode";
            
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        }

        res.json({ success: true });

    } catch (error: any) {
        console.error("Error installing opencode:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
