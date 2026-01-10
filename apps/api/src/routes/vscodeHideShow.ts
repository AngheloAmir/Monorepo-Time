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


router.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const { hide, activePath } : { hide: boolean, activePath: string[] } = req.body;

        await ensureSettingsFile();
        const settingsPath = getSettingsPath();
        const settings = await fs.readJson(settingsPath);
        
        if (!settings['files.exclude']) {
            settings['files.exclude'] = {};
        }

        // 1. Always ensure defaults are hidden
        Object.assign(settings['files.exclude'], EXCLUDE_PATTERNS_DEFAULT);

        if (hide) {
            // 2. If hide is true, merge ALL patterns
            Object.assign(settings['files.exclude'], EXCLUDE_PATTERNS);
        } else {
            // 3. If hide is false, remove patterns that are NOT in defaults
            Object.keys(EXCLUDE_PATTERNS).forEach(key => {
                // strict check against defaults
                // We check if this key exists in EXCLUDE_PATTERNS_DEFAULT
                if (!Object.prototype.hasOwnProperty.call(EXCLUDE_PATTERNS_DEFAULT, key)) {
                    delete settings['files.exclude'][key];
                }
            });
        }

        await fs.writeJson(settingsPath, settings, { spaces: 4 });
        res.json({ success: true, isHidden: hide });

    } catch (error) {
        console.error("Error updating VSCode settings:", error);
        res.status(500).json({ error: 'Failed to update VSCode settings' });
    }
});

export default router;
