import express from 'express';
import { Server, Socket } from 'socket.io';
import { WorkspaceInfo } from 'types';
import { findTemplate, executeTemplate } from './template';

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

            if (!workspace || !workspace.path || !templatename) {
                socket.emit('template:error', { error: 'Missing workspace info or template name' });
                return;
            }

            const workspacePath = workspace.path;
            const template      = findTemplate(templatename);
            if (!template) {
                socket.emit('template:error', { error: `Template '${templatename}' not found` });
                return;
            }


            console.log('template', template);


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
