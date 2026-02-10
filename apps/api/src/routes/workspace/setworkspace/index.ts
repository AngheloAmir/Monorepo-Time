import express from 'express';
import { Server, Socket } from 'socket.io';
import { WorkspaceInfo } from 'types';
import { findTemplate, executeTemplate } from './template';
import { findMonorepoRoot } from './utils';
import path from 'path';
import { promises as fs } from 'fs';

const router = express.Router();

// HTTP route for backwards compatibility
router.post('/', async (req, res) => {
    res.status(400).json({ error: "This endpoint is deprecated. Please use the socket endpoint." });
});

export default router;

/**
 * Socket handler for real-time template setup with progress updates.
 */
export function setWorkspaceTemplateSocket(io: Server) {
    io.on('connection', (socket: Socket) => {

        socket.on('template:start', async (data: { workspace: WorkspaceInfo, templatename: string }) => {
            const { workspace, templatename } = data;
       
            if (!workspace && !templatename) {
                socket.emit('template:error', { error: 'Missing workspace info or template name' });
                return;
            }

            // Default to current working directory if workspace path is missing (e.g. valid for tools/opensource added from root)
            let workspacePath = workspace?.path || process.cwd();
            const template = findTemplate(templatename);
            if (!template) {
                socket.emit('template:error', { error: `Template '${templatename}' not found` });
                return;
            }

            if (template.type === 'tool' || template.type === 'opensource-app') {
                const root = await findMonorepoRoot(workspacePath);
                const toolFolderName = template.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                workspacePath = path.join(root, 'opensource', toolFolderName);

                try {
                    await fs.access(workspacePath);
                    socket.emit('template:error', { error: `Tool '${template.name}' is already installed at ${workspacePath}.` });
                    return;
                } catch { }

                // Create the directory since we are about to write to it
                await fs.mkdir(workspacePath, { recursive: true });

                const toolName   = template.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                const pkgPath    = path.join(workspacePath, 'package.json');
                let pkgData: any = { name: toolName, version: '0.0.0', private: true };

                try {
                    const currentFile = await fs.readFile(pkgPath, 'utf-8');
                    const parsed      = JSON.parse(currentFile);
                    pkgData           = { ...parsed, name: toolName };
                } catch { }
                await fs.writeFile(pkgPath, JSON.stringify(pkgData, null, 2));
                socket.emit('template:progress', { message: 'Configured package.json' });
            }

            socket.emit('template:progress', { message: `Starting template '${templatename}'...` });
            console.log(`[Socket] Applying template '${templatename}' to ${workspacePath}...`);

            try {
                await executeTemplate(template, workspacePath, (message) => {
                    socket.emit('template:progress', { message });
                    console.log(`[Socket] ${message}`);
                });

                socket.emit('template:success', { message: 'Template applied successfully' });
                console.log(`[Socket] Template '${templatename}' applied successfully`);

            } catch (error: any) {
                console.error('[Socket] Error setting workspace template:', error);
                socket.emit('template:error', { error: 'Failed to apply template: ' + error.message });
            }
        });
    });
}
