import { promises as fsPromises } from 'fs';
import path from 'path';

/**
 * Ensures a directory exists.
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
    try {
        await fsPromises.mkdir(dirPath, { recursive: true });
    } catch (err: any) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}

/**
 * Writes a file safely.
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
    const dirName = path.dirname(filePath);
    await ensureDirectory(dirName);
    await fsPromises.writeFile(filePath, content, { encoding: 'utf8' });
}

/**
 * Platform-specific settings.
 */
export const isWindows = process.platform === 'win32';

/**
 * Finds the monorepo root by looking for specific markers.
 */
export async function findMonorepoRoot(startDir: string): Promise<string> {
    let currentDir = startDir;
    while (true) {
        // Check for common monorepo markers
        const markers = ['pnpm-workspace.yaml', 'turbo.json', 'lerna.json', '.git'];
        for (const marker of markers) {
             try {
                await fsPromises.stat(path.join(currentDir, marker));
                return currentDir;
            } catch {
                // Continue checking
            }
        }

        // Check for package.json with workspaces
        try {
            const pkgPath = path.join(currentDir, 'package.json');
            const content = await fsPromises.readFile(pkgPath, 'utf8');
            const pkg = JSON.parse(content);
            if (pkg.workspaces) {
                return currentDir;
            }
        } catch {
            // Ignore missing package.json or parse errors
        }

        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            // Reached filesystem root without finding monorepo root, fallback to startDir
            return startDir;
        }
        currentDir = parentDir;
    }
}
