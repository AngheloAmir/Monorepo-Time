
import express from 'express';
import MonorepoTemplates from 'template';
import { WorkspaceInfo } from 'types';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Server, Socket } from 'socket.io';

const router = express.Router();

const isWindows = process.platform === 'win32';

/**
 * Preprocesses a command to make it cross-platform compatible.
 * Replaces bash-specific syntax with alternatives that work on both Windows and Unix.
 * 
 * @param command - The original command string
 * @param cwd - The current working directory (used for variable substitution)
 * @returns The preprocessed command string
 */
function preprocessCommand(command: string, cwd: string): string {
    let processedCommand = command;
    
    // Replace $(basename $PWD) with the actual directory name
    // This bash syntax doesn't work on Windows
    if (processedCommand.includes('$(basename $PWD)')) {
        const dirName = path.basename(cwd);
        processedCommand = processedCommand.replace(/\$\(basename \$PWD\)/g, dirName);
    }
    
    // Replace rm -rf cleanup commands with cross-platform alternative
    // Pattern: rm -rf ./* ./.[!.]* 2>/dev/null || true
    if (processedCommand.match(/rm\s+-rf\s+\.\/\*\s+\.\/\.\[!\.\]\*.*$/)) {
        if (isWindows) {
            // On Windows, use PowerShell to remove all files and folders
            processedCommand = 'powershell -Command "Get-ChildItem -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"';
        } else {
            // Keep the original command for Unix, but ensure it's properly formatted
            processedCommand = 'rm -rf ./* ./.[!.]* 2>/dev/null || true';
        }
    }
    
    // Replace python3 with python on Windows (Python installer on Windows uses 'python')
    if (isWindows && processedCommand.includes('python3')) {
        processedCommand = processedCommand.replace(/\bpython3\b/g, 'python');
    }
    
    return processedCommand;
}

/**
 * Executes a command using spawn with shell mode.
 * Returns a promise that resolves when the command completes successfully,
 * or rejects with an error containing stdout/stderr on failure.
 * 
 * Note: We pass the command as a single string to avoid DEP0190 deprecation warning.
 * The shell option is set to true for cross-platform compatibility.
 */
function runCommand(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        // Set up non-interactive environment with auto-yes
        const env = {
            ...process.env,
            CI: 'true',                    // Most tools detect this and skip interactive prompts
            npm_config_yes: 'true',        // npm/npx auto-yes
            FORCE_COLOR: '0',              // Disable colors for cleaner logging
            DEBIAN_FRONTEND: 'noninteractive', // For apt-get if ever used
            TERM: 'dumb',
            // Ensure PATH includes common locations for shell executables
            PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'
        };

        // Use the command directly as a string (first argument) with empty args array
        // This avoids the DEP0190 deprecation warning about passing args with shell: true
        // shell: true is cross-platform - uses cmd.exe on Windows, /bin/sh on Unix
        const child = spawn(command, [], {
            cwd: cwd,
            env: env,
            shell: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Auto-respond with 'y' + Enter for any prompts that might slip through
        // This handles edge cases where CI detection fails
        if (child.stdin) {
            const autoResponder = setInterval(() => {
                try {
                    child.stdin?.write('y\n');
                } catch {
                    // Ignore write errors if stdin is closed
                }
            }, 500);

            child.on('close', () => clearInterval(autoResponder));
            child.on('error', () => clearInterval(autoResponder));
        }

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (err) => {
            reject(new Error(`Spawn error: ${err.message}\nstderr: ${stderr}`));
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command exited with code ${code}\nstderr: ${stderr}\nstdout: ${stdout}`));
            }
        });
    });
}

// Keep the HTTP route for backwards compatibility
router.post('/', async (req, res) => {
    try {
        const { workspace, templatename } = req.body as { workspace: WorkspaceInfo, templatename: string };

        if (!workspace || !workspace.path || !templatename) {
            return res.status(400).json({ error: "Missing workspace info or template name" });
        }

        const workspacePath = workspace.path; 

        // Find the template
        let foundTemplate = null;

        console.log( 'workspacePath', workspacePath )
        console.log( 'templatename', templatename );
        
        const categories = ['project', 'database', 'services', 'demo'] as const;
        for (const cat of categories) {
            const list = MonorepoTemplates[cat];
            if (Array.isArray(list)) {
                const match = list.find(t => t.name === templatename);
                if (match) {
                    foundTemplate = match;
                    break;
                }
            }
        }

        if (!foundTemplate) {
            return res.status(404).json({ error: `Template '${templatename}' not found` });
        }

         console.log(`Applying template '${templatename}' to ${workspacePath}...`);

        // Process templating actions
        for (const step of foundTemplate.templating) {
            if (step.action === 'command' && step.command) {
                const processedCommand = preprocessCommand(step.command, workspacePath);
                console.log(`Executing command: ${processedCommand}`);
                try {
                    await runCommand(processedCommand, workspacePath);
                } catch (cmdErr: any) {
                    console.error(`Command failed: ${step.command}`, cmdErr);
                     // Decide if we want to stop or continue. Usually stopping is safer.
                    return res.status(500).json({ error: `Command failed: ${step.command}\n${cmdErr.message}` });
                }
            } else if (step.action === 'file' && step.file && step.filecontent !== undefined) {
                 console.log(`Creating file: ${step.file}`);
                 const filePath = path.join(workspacePath, step.file);
                 const dirName = path.dirname(filePath);

                 // Ensure directory exists
                 if (!fs.existsSync(dirName)) {
                     fs.mkdirSync(dirName, { recursive: true });
                 }

                 fs.writeFileSync(filePath, step.filecontent);
            }
        }

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

            // Validate input
            if (!workspace || !workspace.path || !templatename) {
                socket.emit('template:error', { error: 'Missing workspace info or template name' });
                return;
            }

            const workspacePath = workspace.path;

            // Find the template
            let foundTemplate = null;
            const categories = ['project', 'database', 'services', 'demo'] as const;
            for (const cat of categories) {
                const list = MonorepoTemplates[cat];
                if (Array.isArray(list)) {
                    const match = list.find(t => t.name === templatename);
                    if (match) {
                        foundTemplate = match;
                        break;
                    }
                }
            }

            if (!foundTemplate) {
                socket.emit('template:error', { error: `Template '${templatename}' not found` });
                return;
            }

            socket.emit('template:progress', { message: `Starting template '${templatename}'...` });
            console.log(`[Socket] Applying template '${templatename}' to ${workspacePath}...`);

            try {
                // Process templating actions
                for (const step of foundTemplate.templating) {
                    if (step.action === 'command' && step.command) {
                        const processedCommand = preprocessCommand(step.command, workspacePath);
                        // Send progress update before running command
                        socket.emit('template:progress', { message: `Running: ${processedCommand}` });
                        console.log(`[Socket] Executing command: ${processedCommand}`);

                        try {
                            await runCommand(processedCommand, workspacePath);
                        } catch (cmdErr: any) {
                            console.error(`[Socket] Command failed: ${step.command}`, cmdErr);
                            socket.emit('template:error', { 
                                error: `Command failed: ${step.command}\n${cmdErr.message}` 
                            });
                            return;
                        }
                    } else if (step.action === 'file' && step.file && step.filecontent !== undefined) {
                        // Send progress update for file creation
                        socket.emit('template:progress', { message: `Creating file: ${step.file}` });
                        console.log(`[Socket] Creating file: ${step.file}`);

                        const filePath = path.join(workspacePath, step.file);
                        const dirName = path.dirname(filePath);

                        // Ensure directory exists
                        if (!fs.existsSync(dirName)) {
                            fs.mkdirSync(dirName, { recursive: true });
                        }

                        fs.writeFileSync(filePath, step.filecontent);
                    }
                }

                socket.emit('template:success', { message: 'Template applied successfully' });
                console.log(`[Socket] Template '${templatename}' applied successfully`);

            } catch (error: any) {
                console.error('[Socket] Error setting workspace template:', error);
                socket.emit('template:error', { error: 'Failed to apply template: ' + error.message });
            }
        });
    });
}
