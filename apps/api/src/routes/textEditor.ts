import { Router, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { ROOT } from './rootPath';

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

// POST /new - Create a new file or folder - valid body: { path: string }
// If path has an extension (contains "."), creates a file; otherwise creates a folder
router.post('/new', async (req: Request, res: Response) => {
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
            res.status(400).json({ error: 'A file or folder with that path already exists' });
            return;
        }

        // Determine if it's a file or folder based on extension
        const name = path.basename(itemPath);
        const isFile = name.includes('.');

        if (isFile) {
            // Create empty file (ensures parent directories exist)
            console.log('Creating file', itemPath);
            await fs.outputFile(itemPath, '');
            res.json({ success: true, message: 'File created successfully', type: 'file' });
        } else {
            // Create folder
            console.log('Creating folder', itemPath);
            await fs.ensureDir(itemPath);
            const exists = await fs.pathExists(itemPath);
            console.log('Folder created, exists:', exists);
            res.json({ success: true, message: 'Folder created successfully', type: 'folder', path: itemPath, verified: exists });
        }
    } catch (error: any) {
        console.error('Error creating:', error);
        res.status(500).json({ error: 'Failed to create', details: error.message });
    }
});

export default router;
