import { Router, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { ROOT } from './rootPath';

const router = Router();

// POST /getFileContent - valid body: { path: string }
router.post('/get', async (req: Request, res: Response) => {
    try {
        let { path: filePath } = req.body;

        if (!filePath) {
            res.status(400).json({ error: 'File path is required' });
            return;
        }

        // Resolve against ROOT if not absolute
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(ROOT, filePath);
        }

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

        // Resolve against ROOT if not absolute
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(ROOT, filePath);
        }

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

export default router;
