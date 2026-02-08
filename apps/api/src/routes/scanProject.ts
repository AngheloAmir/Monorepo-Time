import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import fg from "fast-glob";
import { execa } from "execa";

const router = Router();

const ROOT = process.cwd(); // Or implementing findMonorepoRoot if needed. Since I was already using process.cwd() as START_DIR, then finding it. Let's reimplement findMonorepoRoot to be safe/consistent.

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = fs.readJsonSync(pkgPath);
        if (pkg.workspaces) {
          return dir;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    if (fs.existsSync(path.join(dir, ".vscode"))) {
        return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

const MONOREPO_ROOT = findMonorepoRoot(ROOT);

const getSettingsPath = () => {
    return path.join(MONOREPO_ROOT, '.vscode/settings.json');
};

const DEFAULT_IGNORES = [
    '**/node_modules',
    '**/.git',
    '**/.turbo',
    '**/dist',
    '**/out',
    '**/build',
    '**/coverage'
];

router.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const settingsPath = getSettingsPath();
        let settings: any = {};
        if (await fs.pathExists(settingsPath)) {
            settings = await fs.readJson(settingsPath);
        }

        const excludes = settings['files.exclude'] || {};
        const vscodeIgnores = Object.keys(excludes).filter(k => excludes[k] === true);

        // Read .gitignore
        let gitIgnores: string[] = [];
        const gitignorePath = path.join(MONOREPO_ROOT, '.gitignore');
        if (await fs.pathExists(gitignorePath)) {
            const content = await fs.readFile(gitignorePath, 'utf-8');
            gitIgnores = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(line => {
                    // Normalize patterns for fast-glob
                    if (line.startsWith('/')) return line.substring(1); 
                    // fast-glob matches relative to cwd, so "dist" matches "dist" in root.
                    // But typically gitignore "dist" matches "**/dist" (any level) unless anchored.
                    // For now, let's treat simple names as deep matches if they don't contain slashes?
                    // Actually, simple gitignore patterns match recursively.
                    // "dist" -> "**/dist"
                    if (!line.includes('/')) return `**/${line}`;
                    return line;
                });
        }
        
        // Combine all ignores
        // We use a Set to deduplicate
        const uniqueIgnores = new Set([
            ...DEFAULT_IGNORES,
            ...vscodeIgnores,
            ...gitIgnores
        ]);
        
        const ignorePatterns = Array.from(uniqueIgnores);

        const files = await fg('**/*', { 
            cwd: MONOREPO_ROOT, 
            ignore: ignorePatterns,
            dot: true, 
            onlyFiles: true
        });

        // Get Git Status
        let gitStatusMap: Record<string, string> = {};
        try {
            const { stdout } = await execa('git', ['status', '--porcelain'], { cwd: MONOREPO_ROOT });
            stdout.split('\n').forEach(line => {
                if (!line) return;
                const status = line.substring(0, 2);
                const file = line.substring(3).trim();
                gitStatusMap[file] = status;
            });
        } catch (e) {
            console.warn("Failed to get git status:", e);
        }

        const getFileColor = (filePath: string) => {
            const status = gitStatusMap[filePath];
            if (!status) return "none";
            if (status.includes('?') || status.includes('A')) return "green";
            if (status.includes('M')) return "orange";
            return "none";
        };

        const root: any[] = [];
        
        const addFileToTree = (pathParts: string[], currentLevel: any[], fullPath: string) => {
             const part = pathParts[0];
             const isFile = pathParts.length === 1;
             
             if (isFile) {
                 currentLevel.push({
                     file: part,
                     path: '@' + fullPath,
                     color: getFileColor(fullPath)
                 });
             } else {
                 let folder = currentLevel.find((item: any) => item.folder === part);
                 if (!folder) {
                     folder = { folder: part, content: [], color: "none" };
                     currentLevel.push(folder);
                 }
                 addFileToTree(pathParts.slice(1), folder.content, fullPath);
             }
        };
        
        files.forEach(file => {
             addFileToTree(file.split('/'), root, file);
        });

        const bubbleStatus = (items: any[]) => {
            let hasOrange = false;
            let hasGreen = false;

            items.forEach(item => {
                if (item.folder && item.content) {
                    const childColor = bubbleStatus(item.content);
                    item.color = childColor;
                }
                
                if (item.color === 'orange') hasOrange = true;
                if (item.color === 'green') hasGreen = true;
            });

            if (hasOrange) return 'orange';
            if (hasGreen) return 'green';
            return 'none';
        };

        bubbleStatus(root);

        const sortTree = (items: any[]) => {
            items.sort((a, b) => {
                const aName = a.folder || a.file;
                const bName = b.folder || b.file;
                const aIsFolder = !!a.folder;
                const bIsFolder = !!b.folder;
                
                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;
                return aName.localeCompare(bName);
            });
            items.forEach(item => {
                if (item.folder && item.content) {
                    sortTree(item.content);
                }
            });
        };
        
        sortTree(root);

        res.json({ root });
    } catch (error) {
        console.error("Error scanning project:", error);
        res.status(500).json({ error: 'Failed to scan project' });
    }
});

export default router;
