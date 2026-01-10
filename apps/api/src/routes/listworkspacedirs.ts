import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";

const router = Router();
const START_DIR = process.cwd();

// Find the monorepo root (where package.json with "workspaces" is defined)
// If not found, default to START_DIR
const findRoot = async (dir: string): Promise<string> => {
    const pkgPath = path.join(dir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
        try {
            const pkg = await fs.readJSON(pkgPath);
            // If "workspaces" is defined, we assume this is the root
            if (pkg.workspaces) {
                return dir;
            }
        } catch {
            // ignore
        }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return START_DIR;
    return findRoot(parent);
};

router.get("/", async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");

    try {
        const rootPath = await findRoot(START_DIR);
        const pkgPath = path.join(rootPath, 'package.json');
        
        let workspaceDirs: { label: string, path: string }[] = [];
        let foundWorkspaces = false;

        // 1. Try to read "workspaces" from package.json
        if (await fs.pathExists(pkgPath)) {
            const pkg = await fs.readJSON(pkgPath);
            let globs: string[] = [];
            
            if (pkg.workspaces) {
                 if (Array.isArray(pkg.workspaces)) {
                     globs = pkg.workspaces;
                 } else if (pkg.workspaces.packages && Array.isArray(pkg.workspaces.packages)) {
                     globs = pkg.workspaces.packages;
                 }
            }

            if (globs.length > 0) {
                 foundWorkspaces = true;
                 const uniqueDirs = new Set<string>();
                 
                 for (const pattern of globs) {
                     // Pattern examples: "apps/*", "packages/*", "libs/my-lib"
                     // We want the top-level folder, e.g. "apps", "packages", "libs"
                     const parts = pattern.split('/');
                     if (parts.length > 0) {
                         const topLevel = parts[0];
                         // filter out if the pattern was just "*" (unlikely but possible) or empty
                         if (topLevel && topLevel !== '*') {
                             uniqueDirs.add(topLevel);
                         }
                     }
                 }

                 for (const dirName of uniqueDirs) {
                     const fullPath = path.join(rootPath, dirName);
                     if (await fs.pathExists(fullPath)) {
                         workspaceDirs.push({
                             label: dirName,
                             path: fullPath
                         });
                     }
                 }
            }
        }

        // 2. If no workspaces defined, fallback to scanning root
        if (!foundWorkspaces) {
            const items = await fs.readdir(rootPath, { withFileTypes: true });
            workspaceDirs = items
                .filter(item => item.isDirectory())
                .filter(item => {
                    const name = item.name;
                    // Exclude node_modules
                    if (name === 'node_modules') return false;
                    // Exclude hidden fs (start with .)
                    if (name.startsWith('.')) return false;
                    // Exclude folders starting with _
                    if (name.startsWith('_')) return false;
                    return true;
                })
                .map(item => ({
                    label: item.name,
                    path: path.join(rootPath, item.name)
                }));
        }

        return res.json(workspaceDirs);

    } catch (e: any) {
        console.error("Error listing workspaces:", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
