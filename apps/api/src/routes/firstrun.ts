import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const monorepoTimePath = path.join(ROOT, "monorepotime.json");
        const exists = fs.existsSync(monorepoTimePath);

        if (!exists) {
            // Create the file with default content from scaffold if it doesn't exist
            // This marks that the app has run at least once (after this request)
            try {
                const scaffoldPath = path.join(__dirname, 'scaffold', 'monorepotime.json');
                const defaultContent = await fs.readJson(scaffoldPath);
                fs.writeJsonSync(monorepoTimePath, defaultContent, { spaces: 4 });
            } catch (err) {
                 console.error("Error reading scaffold file for firstrun:", err);
                 // Fallback to empty if scaffold fails
                 fs.writeJsonSync(monorepoTimePath, { notes: "", crudtest: [] }, { spaces: 4 });
            }

            // Check if .gitignore exists, if not create it with default content
            const gitIgnorePath = path.join(ROOT, ".gitignore");
            if (!fs.existsSync(gitIgnorePath)) {
                const gitIgnoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

package-lock.json
out
.turbo`;
                try {
                    fs.writeFileSync(gitIgnorePath, gitIgnoreContent);
                    console.log("Created .gitignore");
                } catch (err) {
                    console.error("Failed to create .gitignore:", err);
                }
            }

            // Check if git is initialized, if not initialize it
            const gitPath = path.join(ROOT, ".git");
            if (!fs.existsSync(gitPath)) {
                try {
                    console.log("Initializing git repository...");
                    await execAsync("git init", { cwd: ROOT });
                    await execAsync("git add .", { cwd: ROOT });
                    await execAsync("git branch -M master", { cwd: ROOT });
                    await execAsync('git commit -m "init"', { cwd: ROOT });
                    console.log("Git initialized successfully");
                } catch (gitError) {
                    console.error("Failed to initialize git:", gitError);
                }
            }

            res.json({ isFirstTime: true });
        } else {
            res.json({ isFirstTime: false });
        }
    } catch (error) {
        console.error("First run check error:", error);
        res.status(500).json({ 
            error: "Failed to check first run status", 
            details: error instanceof Error ? error.message : String(error) 
        });
    }
});

export default router;
