import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import fg from "fast-glob";
import { execa } from "execa";

const router = Router();

const ROOT = process.cwd();

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
const DOCS_ROOT = path.join(MONOREPO_ROOT, 'docs');

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
    '**/coverage',
    '**/*.mtmeta.json'
];

router.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        if (!(await fs.pathExists(DOCS_ROOT))) {
            return res.json({ 
                root: DOCS_ROOT, 
                content: [], 
                changes: 0 
            });
        }

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
                    if (line.startsWith('/')) return line.substring(1); 
                    if (!line.includes('/')) return `**/${line}`;
                    return line;
                });
        }
        
        const uniqueIgnores = new Set([
            ...DEFAULT_IGNORES,
            ...vscodeIgnores,
            ...gitIgnores
        ]);
        
        const ignorePatterns = Array.from(uniqueIgnores);

        // Scan only the docs directory
        const files = await fg('**/*', { 
            cwd: DOCS_ROOT, 
            ignore: ignorePatterns,
            dot: true, 
            onlyFiles: false,
            markDirectories: true,
            suppressErrors: true
        });

        // Get Git Status for the whole monorepo
        let gitStatusMap: Record<string, string> = {};
        let untrackedDirs: Set<string> = new Set();
        try {
            const { stdout } = await execa('git', ['status', '--porcelain', '-uall'], { cwd: MONOREPO_ROOT });
            stdout.split('\n').forEach(line => {
                if (!line) return;
                const status = line.substring(0, 2);
                const file = line.substring(3).trim();
                gitStatusMap[file] = status;
                
                if (status.includes('?')) {
                    const parts = file.split('/');
                    let dirPath = '';
                    for (let i = 0; i < parts.length - 1; i++) {
                        dirPath = dirPath ? `${dirPath}/${parts[i]}` : parts[i];
                        untrackedDirs.add(dirPath);
                    }
                }
            });
        } catch (e) {
            console.warn("Failed to get git status:", e);
        }

        const getFileColor = (filePath: string, isDirectory: boolean = false) => {
            const status = gitStatusMap[filePath];
            if (status) {
                if (status.includes('?') || status.includes('A')) return "green";
                if (status.includes('M')) return "yellow";
            }
            if (isDirectory && untrackedDirs.has(filePath)) {
                return "green";
            }
            return "none";
        };

        const root: any[] = [];
        
        const addFileToTree = (pathParts: string[], currentLevel: any[], currentPrefix: string, isDirectory: boolean) => {
             const part = pathParts[0];
             // The path stored in the tree must be relative to MONOREPO_ROOT for the editor to work
             // So we prepend 'docs' to it.
             const currentPath = currentPrefix ? `${currentPrefix}/${part}` : `docs/${part}`;
             const isLastPart = pathParts.length === 1;
             
             if (isLastPart) {
                 if (isDirectory) {
                     let folder = currentLevel.find((item: any) => item.folder === part);
                     if (!folder) {
                         folder = { 
                             folder: part, 
                             content: [], 
                             color: getFileColor(currentPath, true),
                             path: currentPath 
                         };
                         currentLevel.push(folder);
                     }
                 } else {
                     currentLevel.push({
                         file: part,
                         path: currentPath,
                         color: getFileColor(currentPath)
                     });
                 }
             } else {
                 let folder = currentLevel.find((item: any) => item.folder === part);
                 if (!folder) {
                     folder = { 
                         folder: part, 
                         content: [], 
                         color: getFileColor(currentPath, true),
                         path: currentPath 
                     };
                     currentLevel.push(folder);
                 }
                 addFileToTree(pathParts.slice(1), folder.content, currentPath, isDirectory);
             }
        };
        
        files.forEach(file => {
             const isDirectory = file.endsWith('/');
             const cleanPath = isDirectory ? file.slice(0, -1) : file;
             addFileToTree(cleanPath.split('/'), root, '', isDirectory);
        });

        const bubbleStatus = (items: any[]) => {
            let hasYellow = false;
            let hasGreen  = false;

            items.forEach(item => {
                if (item.folder && item.content) {
                    const childColor = bubbleStatus(item.content);
                    item.color = childColor;
                }
                
                if (item.color === 'yellow') hasYellow = true;
                if (item.color === 'green') hasGreen = true;
            });

            if (hasYellow) return 'yellow';
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

        const changes = Object.keys(gitStatusMap).filter(k => k.startsWith('docs/')).length;

        res.json({ 
            root: DOCS_ROOT, 
            content: root, 
            changes 
        });
    } catch (error) {
        console.error("Error scanning docs:", error);
        res.status(500).json({ error: 'Failed to scan docs' });
    }
});

export default router;
