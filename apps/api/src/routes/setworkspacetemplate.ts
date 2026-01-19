import express from 'express';
import MonorepoTemplates from 'template';
import { WorkspaceInfo } from 'types';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { execa, ExecaError } from 'execa';
import { Server, Socket } from 'socket.io';

const router = express.Router();

/**
 * Ensures a directory exists.
 */
async function ensureDirectory(dirPath: string): Promise<void> {
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
async function writeFile(filePath: string, content: string): Promise<void> {
    const dirName = path.dirname(filePath);
    await ensureDirectory(dirName);
    await fsPromises.writeFile(filePath, content, { encoding: 'utf8' });
}

/**
 * Platform-specific settings.
 */
const isWindows = process.platform === 'win32';

/**
 * Preprocesses a command to make it cross-platform compatible.
 * 
 * @param command - The original command string
 * @param cwd - The current working directory
 * @returns The preprocessed command string
 */
function preprocessCommand(command: string, cwd: string): string {
    let processedCommand = command;
    
    // Replace $(basename $PWD) with the actual directory name
    if (processedCommand.includes('$(basename $PWD)')) {
        const dirName = path.basename(cwd);
        processedCommand = processedCommand.replace(/\$\(basename \$PWD\)/g, dirName);
    }
    
    // Handle cleanup commands
    if (processedCommand.match(/rm\s+-rf\s+\.\/\*\s+\.\/\.\[!\.\]\*.*$/)) {
        if (isWindows) {
            processedCommand = 'powershell -Command "Get-ChildItem -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"';
        } else {
            processedCommand = 'rm -rf ./* ./.[!.]* 2>/dev/null || true';
        }
    }
    
    // Replace python3 with python on Windows
    if (isWindows && processedCommand.includes('python3')) {
        processedCommand = processedCommand.replace(/\bpython3\b/g, 'python');
    }
    
    return processedCommand;
}

/**
 * Execute a command using execa.
 * 
 * Execa provides:
 * - Better promise handling
 * - Proper signal handling
 * - Clean stdout/stderr capture
 * - Better cross-platform support
 * - No IDE file watcher conflicts (runs in isolated process)
 */
async function runCommand(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
    try {
        // Use execa with shell mode for complex commands
        // The 'shell' option handles npm, npx, and other commands properly
        const result = await execa(command, {
            cwd,
            shell: true,
            // Detach from parent's stdio to avoid IDE terminal conflicts
            stdin: 'ignore',
            // Set non-interactive environment
            env: {
                ...process.env,
                CI: 'true',
                npm_config_yes: 'true',
                FORCE_COLOR: '0',
                DEBIAN_FRONTEND: 'noninteractive',
            },
            // Don't throw on non-zero exit (we handle it ourselves)
            reject: true,
            // Kill the whole process tree on abort
            killSignal: 'SIGTERM',
            // Timeout after 5 minutes (for npm install which can be slow)
            timeout: 300000,
        });

        return { stdout: result.stdout || '', stderr: result.stderr || '' };
    } catch (error) {
        const execaError = error as ExecaError;
        throw new Error(
            `Command failed: ${command}\n` +
            `Exit code: ${execaError.exitCode}\n` +
            `stderr: ${execaError.stderr || 'N/A'}\n` +
            `stdout: ${execaError.stdout || 'N/A'}`
        );
    }
}

/**
 * Finds a template by name across all categories.
 */
function findTemplate(templatename: string) {
    const categories = ['project', 'database', 'services', 'demo'] as const;
    for (const cat of categories) {
        const list = MonorepoTemplates[cat];
        if (Array.isArray(list)) {
            const match = list.find(t => t.name === templatename);
            if (match) {
                return match;
            }
        }
    }
    return null;
}

/**
 * Execute template steps.
 * 
 * @param template - The template to execute
 * @param workspacePath - The workspace path
 * @param onProgress - Optional callback for progress updates
 */
async function executeTemplate(
    template: ReturnType<typeof findTemplate>,
    workspacePath: string,
    onProgress?: (message: string) => void
): Promise<void> {
    if (!template) {
        throw new Error('Template not found');
    }

    const progress = onProgress || ((msg: string) => console.log(`[Template] ${msg}`));

    for (const step of template.templating) {
        if (step.action === 'command' && step.command) {
            const processedCommand = preprocessCommand(step.command, workspacePath);
            progress(`Running: ${processedCommand}`);
            
            try {
                const result = await runCommand(processedCommand, workspacePath);
                if (result.stdout.trim()) {
                    // Only show first 200 chars of output to avoid flooding logs
                    const truncated = result.stdout.trim().slice(0, 200);
                    progress(`Output: ${truncated}${result.stdout.length > 200 ? '...' : ''}`);
                }
            } catch (cmdErr: any) {
                console.error(`Command failed: ${step.command}`, cmdErr);
                throw new Error(`Command failed: ${step.command}\n${cmdErr.message}`);
            }
        } else if (step.action === 'file' && step.file && step.filecontent !== undefined) {
            progress(`Creating file: ${step.file}`);
            const filePath = path.join(workspacePath, step.file);
            await writeFile(filePath, step.filecontent);
        }
    }
}

// HTTP route for backwards compatibility
router.post('/', async (req, res) => {
    try {
        const { workspace, templatename } = req.body as { workspace: WorkspaceInfo, templatename: string };

        if (!workspace || !workspace.path || !templatename) {
            return res.status(400).json({ error: "Missing workspace info or template name" });
        }

        const workspacePath = workspace.path;
        console.log('workspacePath', workspacePath);
        console.log('templatename', templatename);

        const template = findTemplate(templatename);
        if (!template) {
            return res.status(404).json({ error: `Template '${templatename}' not found` });
        }

        console.log(`Applying template '${templatename}' to ${workspacePath}...`);
        await executeTemplate(template, workspacePath);

        res.json({ success: true, message: "Template applied successfully" });

    } catch (error: any) {
        console.error("Error setting workspace template:", error);
        res.status(500).json({ error: "Failed to apply template: " + error.message });
    }
});

export default router;

/**
 * Socket handler for real-time template setup with progress updates.
 * 
 * Events emitted by server:
 * - 'template:progress' - { message: string } progress update
 * - 'template:success' - { message: string } template applied successfully  
 * - 'template:error' - { error: string } an error occurred
 * 
 * Events listened by server:
 * - 'template:start' - { workspace: WorkspaceInfo, templatename: string }
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
            const template = findTemplate(templatename);

            if (!template) {
                socket.emit('template:error', { error: `Template '${templatename}' not found` });
                return;
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
