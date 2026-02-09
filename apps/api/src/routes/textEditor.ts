import { Router, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ROOT } from './rootPath';

const execAsync = promisify(exec);

const router = Router();

// Helper to resolve paths relative to ROOT
function resolvePath(itemPath: string): string {
    // If path already starts with ROOT, return as-is
    if (itemPath.startsWith(ROOT)) {
        return itemPath;
    }
    // Strip leading slashes and join with ROOT
    const relativePath = itemPath.replace(/^\/+/, '');
    return path.join(ROOT, relativePath);
}

// POST /getFileContent - valid body: { path: string }
router.post('/get', async (req: Request, res: Response) => {
    try {
        let { path: filePath } = req.body;

        if (!filePath) {
            res.status(400).json({ error: 'File path is required' });
            return;
        }

        // Resolve path relative to ROOT
        filePath = resolvePath(filePath);

        // Verify the file exists
        if (!(await fs.pathExists(filePath))) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        const stats = await fs.stat(filePath);
        if (!stats.isFile()) {
            res.status(400).json({ error: 'Path is not a file' });
            return;
        }

        const content = await fs.readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error: any) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Failed to read file', details: error.message });
    }
});

// POST /setFileContent - valid body: { path: string, content: string }
router.post('/set', async (req: Request, res: Response) => {
    try {
        let { path: filePath, content } = req.body;

        if (!filePath) {
            res.status(400).json({ error: 'File path is required' });
            return;
        }

        // Resolve path relative to ROOT
        filePath = resolvePath(filePath);

        if (content === undefined || content === null) {
            res.status(400).json({ error: 'Content is required' });
            return;
        }

        await fs.outputFile(filePath, content);
        res.json({ success: true, message: 'File saved successfully' });
    } catch (error: any) {
        console.error('Error writing file:', error);
        res.status(500).json({ error: 'Failed to write file', details: error.message });
    }
});

// POST /edit - Rename a file or folder - valid body: { path: string, newname: string }
router.post('/edit', async (req: Request, res: Response) => {
    try {
        let { path: itemPath, newname } = req.body;

        if (!itemPath) {
            res.status(400).json({ error: 'Path is required' });
            return;
        }

        if (!newname) {
            res.status(400).json({ error: 'New name is required' });
            return;
        }

        // Resolve path relative to ROOT
        itemPath = resolvePath(itemPath);

        // Verify the path exists
        if (!(await fs.pathExists(itemPath))) {
            res.status(404).json({ error: 'Path not found' });
            return;
        }

        // Get the original file info
        const originalName = path.basename(itemPath);
        const originalExt = path.extname(originalName);
        const isFile = originalExt !== '';

        // Preserve extension if the new name doesn't have one but the original file did
        if (isFile && !newname.includes('.')) {
            newname = newname + originalExt;
        }

        // Get the directory and create new path
        const dir = path.dirname(itemPath);
        const newPath = path.join(dir, newname);

        // Check if new path already exists
        if (await fs.pathExists(newPath)) {
            res.status(400).json({ error: 'A file or folder with that name already exists' });
            return;
        }

        await fs.rename(itemPath, newPath);
        res.json({ success: true, message: 'Renamed successfully', newPath });
    } catch (error: any) {
        console.error('Error renaming:', error);
        res.status(500).json({ error: 'Failed to rename', details: error.message });
    }
});

// POST /delete - Delete a file or folder - valid body: { path: string }
router.post('/delete', async (req: Request, res: Response) => {
    try {
        let { path: itemPath } = req.body;

        if (!itemPath) {
            res.status(400).json({ error: 'Path is required' });
            return;
        }

        // Resolve path relative to ROOT
        itemPath = resolvePath(itemPath);

        // Verify the path exists
        if (!(await fs.pathExists(itemPath))) {
            res.status(404).json({ error: 'Path not found' });
            return;
        }

        // Remove file or folder (fs.remove handles both)
        await fs.remove(itemPath);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting:', error);
        res.status(500).json({ error: 'Failed to delete', details: error.message });
    }
});

// POST /newfile - Create a new file - valid body: { path: string }
// Always creates a file, even without an extension
router.post('/newfile', async (req: Request, res: Response) => {
    try {
        let { path: itemPath } = req.body;

        if (!itemPath) {
            console.log('Path is required');
            res.status(400).json({ error: 'Path is required' });
            return;
        }

        // Resolve path relative to ROOT
        itemPath = resolvePath(itemPath);

        // Check if path already exists
        if (await fs.pathExists(itemPath)) {
            console.log('Path already exists');
            res.status(400).json({ error: 'A file with that path already exists' });
            return;
        }

        // Create empty file (ensures parent directories exist)
        console.log('Creating file', itemPath);
        await fs.outputFile(itemPath, '');
        res.json({ success: true, message: 'File created successfully', type: 'file' });
    } catch (error: any) {
        console.error('Error creating file:', error);
        res.status(500).json({ error: 'Failed to create file', details: error.message });
    }
});

// POST /newfolder - Create a new folder - valid body: { path: string }
// Always creates a folder
router.post('/newfolder', async (req: Request, res: Response) => {
    try {
        let { path: itemPath } = req.body;

        if (!itemPath) {
            console.log('Path is required');
            res.status(400).json({ error: 'Path is required' });
            return;
        }

        // Resolve path relative to ROOT
        itemPath = resolvePath(itemPath);

        // Check if path already exists
        if (await fs.pathExists(itemPath)) {
            console.log('Path already exists');
            res.status(400).json({ error: 'A folder with that path already exists' });
            return;
        }

        // Create folder
        console.log('Creating folder', itemPath);
        await fs.ensureDir(itemPath);
        const exists = await fs.pathExists(itemPath);
        console.log('Folder created, exists:', exists);
        res.json({ success: true, message: 'Folder created successfully', type: 'folder', path: itemPath, verified: exists });
    } catch (error: any) {
        console.error('Error creating folder:', error);
        res.status(500).json({ error: 'Failed to create folder', details: error.message });
    }
});

// POST /diff - Get git diff line information for a file - valid body: { path: string }
// Returns { added: number[], modified: number[] } indicating which lines are new or changed
router.post('/diff', async (req: Request, res: Response) => {
    try {
        let { path: filePath } = req.body;

        if (!filePath) {
            res.status(400).json({ error: 'File path is required' });
            return;
        }

        // Resolve path relative to ROOT
        filePath = resolvePath(filePath);

        // Verify the file exists
        if (!(await fs.pathExists(filePath))) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        // Get the relative path from ROOT for git commands
        const relativePath = path.relative(ROOT, filePath);

        const added: number[] = [];
        const modified: number[] = [];

        try {
            // First check if file is tracked by git
            const { stdout: trackedCheck } = await execAsync(
                `git ls-files --error-unmatch "${relativePath}" 2>/dev/null || echo "untracked"`,
                { cwd: ROOT }
            );

            if (trackedCheck.trim() === 'untracked') {
                // File is untracked - all lines are "added" (new file)
                const content = await fs.readFile(filePath, 'utf-8');
                const lineCount = content.split('\n').length;
                for (let i = 1; i <= lineCount; i++) {
                    added.push(i);
                }
                res.json({ added, modified, isUntracked: true });
                return;
            }

            // Get diff for tracked file using unified format with 0 context lines
            const { stdout: diffOutput } = await execAsync(
                `git diff -U0 HEAD -- "${relativePath}"`,
                { cwd: ROOT }
            );

            if (!diffOutput.trim()) {
                // No changes
                res.json({ added, modified, isUntracked: false });
                return;
            }

            // Parse the diff output
            // Format: @@ -old_start,old_count +new_start,new_count @@
            const hunkRegex = /@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/g;
            let match;

            while ((match = hunkRegex.exec(diffOutput)) !== null) {
                const oldStart = parseInt(match[1], 10);
                const oldCount = match[2] ? parseInt(match[2], 10) : 1;
                const newStart = parseInt(match[3], 10);
                const newCount = match[4] ? parseInt(match[4], 10) : 1;

                if (oldCount === 0) {
                    // Pure addition - lines were only added
                    for (let i = 0; i < newCount; i++) {
                        added.push(newStart + i);
                    }
                } else if (newCount === 0) {
                    // Pure deletion - no lines to highlight in current file
                    // We don't need to track these as there's nothing to show
                } else {
                    // Modification - some lines changed
                    for (let i = 0; i < newCount; i++) {
                        modified.push(newStart + i);
                    }
                }
            }

            res.json({ added, modified, isUntracked: false });
        } catch (gitError: any) {
            // Git command failed - possibly not a git repo
            console.error('Git error:', gitError.message);
            res.json({ added: [], modified: [], error: 'Not a git repository or git error' });
        }
    } catch (error: any) {
        console.error('Error getting diff:', error);
        res.status(500).json({ error: 'Failed to get diff', details: error.message });
    }
});

export default router;
