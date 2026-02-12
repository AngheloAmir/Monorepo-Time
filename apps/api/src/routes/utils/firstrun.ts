import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const turboJsonPath = path.join(ROOT, "turbo.json");
        const packageJsonPath = path.join(ROOT, "package.json");
        
        const turboExists = fs.existsSync(turboJsonPath);
        let packageJsonValid = false;

        if (fs.existsSync(packageJsonPath)) {
            try {
                const pkg = await fs.readJson(packageJsonPath);
                if (pkg.packageManager && pkg.workspaces) {
                    packageJsonValid = true;
                }
            } catch (e) {
                // if invalid json, treat as invalid
            }
        }

        const isFirstTime = !turboExists || !packageJsonValid;

        res.json({ isFirstTime });
    } catch (error) {
        console.error("First run check error:", error);
        res.status(500).json({ 
            error: "Failed to check first run status", 
            details: error instanceof Error ? error.message : String(error) 
        });
    }
});

export default router;
