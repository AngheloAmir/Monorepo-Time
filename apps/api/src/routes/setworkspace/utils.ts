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
