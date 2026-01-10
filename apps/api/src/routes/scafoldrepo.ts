import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { ROOT } from "./rootPath";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const packageJsonPath = path.join(ROOT, "package.json");
        const turboJsonPath = path.join(ROOT, "turbo.json");

        // 1. Read package.json
        if (!fs.existsSync(packageJsonPath)) {
             res.status(400).json({ error: "package.json not found in root" });
             return; // Stop execution
        }
        
        const pkg = fs.readJsonSync(packageJsonPath);
        let pkgChanged = false;

        // 2. Check Workspaces
        if (!pkg.workspaces) {
            pkg.workspaces = ["apps/*", "packages/*"];
            pkgChanged = true;
        }

        // 3. Save package.json if workspaces changed (before install)
        if (pkgChanged) {
            fs.writeJsonSync(packageJsonPath, pkg, { spaces: 2 });
        }

        // 4. Create directories
        await fs.ensureDir(path.join(ROOT, 'apps'));
        await fs.ensureDir(path.join(ROOT, 'packages'));

        // 5. Create turbo.json if not exists
        if (!fs.existsSync(turboJsonPath) || !pkg.devDependencies?.turbo) {
            
            if (!fs.existsSync(turboJsonPath)) {
                const defaultTurbo = {
                    "$schema": "https://turbo.build/schema.json",
                    "pipeline": {
                        "build": {
                            "outputs": ["dist/**", ".next/**"]
                        },
                        "lint": {}
                    }
                };
                fs.writeJsonSync(turboJsonPath, defaultTurbo, { spaces: 2 });
            }
        
             // 6. Commands
             // Check if turbo is in devDependencies
            const hasTurbo = pkg.devDependencies && pkg.devDependencies.turbo;
            
            if (!hasTurbo) {
                 // installing turbo will install deps
                 await runCommand("npm install turbo -D", ROOT);
            } else {
                 // just install to ensure workspaces are linked
                 await runCommand("npm install", ROOT); 
            }
        } else {
             // If everything existed, user requested "then npm install" implies we might still want to ensure state?
             // But the prompt says: "if so [missing turbo.json or turbo dep], then ... then npm install".
             // It also says "if the root package.json has no 'workspaces'... then npm install".
             // To be safe, let's run npm install if we changed workspaces OR if we entered the 'turbo missing' block.
             if (pkgChanged) {
                 await runCommand("npm install", ROOT);
             }
        }

        res.json({ success: true, message: "Scaffolding complete" });

    } catch (error) {
        console.error("Scaffolding error:", error);
        res.status(500).json({ 
            error: "Failed to scaffold", 
            details: error instanceof Error ? error.message : String(error) 
        });
    }
});

function runCommand(cmd: string, cwd: string): Promise<void> {
    console.log(`Running: ${cmd} in ${cwd}`);
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error("Exec error:", stderr);
                reject(error);
            } else {
                console.log(stdout); // Log output
                resolve();
            }
        });
    });
}

export default router;
