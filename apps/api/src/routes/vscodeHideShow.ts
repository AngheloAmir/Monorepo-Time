import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";

const router = Router();

const EXCLUDE_PATTERNS: { [key: string]: boolean } = {
    "**/node_modules": true,
    "**/.git":          true,
    "**/.gitignore":    true,
    "**/.turbo":        true,
    "**/dist":          true,
    "**/_tool":         true,
    "**/package-lock.json":  true,
    "**/Dockerfile":         true,
    "**/docker-compose.yml": true,
    "**/.dockerignore":  true,
    "**/turbo.json":     true,
    "**/nodemon.json":   true,
    "**/temp.md":        true,
    "**/*postcss*":      true,
    "**/*tailwind*":     true,
    "**/*tsconfig*":     true,
    "**/*eslint*":       true,
    "**/*prettier*":     true,
    "**/*vite*":         true,
    "_temp":             true,
    ".gitignore":        true,
    ".vscode":           true,
    "package.json":      true,
    "README.md":         true,
    ".github":           true,
    ".buildkite":        true,
    ".circleci":         true,
    ".gitlab-ci.yml":    true,
    ".travis.yml":       true,
    "out":               true
};

const EXCLUDE_PATTERNS_DEFAULT: { [key: string]: boolean } = {
    "**/.git":  true,
    ".vscode":  true,
    ".turbo":   true,
};

const START_DIR = process.cwd();

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = fs.readJsonSync(pkgPath);
        // heuristic: if it has workspaces or if it is the top with .git
        // But simpler: just look for package.json that seems to be the root. 
        // Or if we are in a monorepo, the one with 'workspaces'. 
        // If not a monorepo, maybe just the one with .vscode?
        // Let's stick to the scanworkspace logic: look for workspaces.
        // If not found, maybe fall back to just the CWD if we assume the user runs it from root.
        if (pkg.workspaces) {
          return dir;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    // Also check for .vscode folder as a strong indicator of "root" for this context
    if (fs.existsSync(path.join(dir, ".vscode"))) {
        return dir;
    }

    dir = path.dirname(dir);
  }
  return startDir;
}

const ROOT = findMonorepoRoot(START_DIR);

const getSettingsPath = () => {
    return path.join(ROOT, '.vscode/settings.json');
};

const ensureSettingsFile = async () => {
    const settingsPath = getSettingsPath();
    const dir = path.dirname(settingsPath);
    await fs.ensureDir(dir);
    if (!await fs.pathExists(settingsPath)) {
        await fs.writeJson(settingsPath, { "files.exclude": {} }, { spaces: 4 });
    }
};


/**
 * POST /
 * Body: { hide: boolean, pathInclude?: string[] }
 * Updates files.exclude in settings.json
 */
router.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const { hide, pathInclude } : { hide: boolean, pathInclude: string[] } = req.body;

        await ensureSettingsFile();
        const settingsPath = getSettingsPath();
        const settings = await fs.readJson(settingsPath);
        
        // We will reconstruct files.exclude based on the logic
        // 1. Start with valid defaults
        const newExcludes: { [key: string]: boolean } = { ...EXCLUDE_PATTERNS_DEFAULT };

        if (hide) {
            // 2a. If hide is true, add the standard patterns
            Object.assign(newExcludes, EXCLUDE_PATTERNS);

            // 2b. Add the specific paths from pathInclude (converted to relative)
            if (Array.isArray(pathInclude)) {
                pathInclude.forEach(p => {
                    // Ensure path is relative to the workspace ROOT
                    const relativePath = path.relative(ROOT, p);
                    if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
                        newExcludes[relativePath] = true;
                    }
                });
            }
        } 
        // 3. If hide is false, we strictly return the defaults (which we already initialized in step 1).
        // This effectively "shows all files" (removes other exclusions) except the defaults.

        // Update the settings object
        settings['files.exclude'] = newExcludes;

        await fs.writeJson(settingsPath, settings, { spaces: 4 });
        res.json({ success: true, isHidden: hide });

    } catch (error) {
        console.error("Error updating VSCode settings:", error);
        res.status(500).json({ error: 'Failed to update VSCode settings' });
    }
});

export default router;
