import { Request, Response, Router } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import treeKill from 'tree-kill';

const router = Router();

// Import activeTerminals for reference only - we handle cleanup ourselves
import { activeTerminals } from './interactiveTerminal';

/**
 * Kills a process tree completely using tree-kill
 * @param pid Process ID to kill
 * @param signal Signal to use (default: SIGKILL)
 */
async function killProcessTree(pid: number, signal: NodeJS.Signals = 'SIGKILL'): Promise<void> {
    return new Promise((resolve, reject) => {
        treeKill(pid, signal, (err) => {
            if (err) {
                console.error(`[StopTerminal] Error killing process tree for PID ${pid}:`, err.message);
                reject(err);
            } else {
                console.log(`[StopTerminal] Successfully killed process tree for PID ${pid}`);
                resolve();
            }
        });
    });
}

/**
 * Stop Docker containers
 */
async function stopDockerContainers(containerIds: string[]): Promise<void> {
    for (const cid of containerIds) {
        try {
            console.log(`[StopTerminal] Stopping container ${cid}`);
            await execa('docker', ['stop', cid]);
            console.log(`[StopTerminal] Stopped container ${cid}`);
            
            // Also remove the container to ensure port is freed
            try {
                await execa('docker', ['rm', cid]);
                console.log(`[StopTerminal] Removed container ${cid}`);
            } catch (rmError: any) {
                console.log(`[StopTerminal] Container ${cid} already removed or doesn't exist`);
            }
        } catch (e: any) {
            console.error(`[StopTerminal] Error stopping container ${cid}:`, e.message);
        }
    }
}

/**
 * Internal function to stop terminal process
 * This replaces the import from interactiveTerminal.ts
 */
function stopTerminalProcessInternal(socketId: string): boolean {
    const session = activeTerminals.get(socketId);
    if (session) {
        const { child, socket } = session;
        
        // Emit closing log before killing
        if (socket.connected) {
            socket.emit('terminal:log', '\r\n\x1b[33m[System] Stopping interactive terminal process...\x1b[0m\r\n');
        }

        // Remove active listeners to prevent side effects during kill
        child.removeAllListeners();
        child.stdout?.removeAllListeners();
        child.stderr?.removeAllListeners();

        // Kill the process tree
        if (child.pid) {
            killProcessTree(child.pid).catch(err => {
                console.error('[StopTerminal] Error in killProcessTree:', err);
                // Fallback to regular kill
                try {
                    child.kill('SIGKILL');
                } catch (e) {
                    console.error('[StopTerminal] Fallback kill also failed:', e);
                }
            });
        } else {
            child.kill();
        }

        activeTerminals.delete(socketId);
        return true;
    }
    return false;
}

router.post('/', async (req: Request, res: Response) => {
    try {
        const { socketId, workspace } = req.body;

        if (workspace && workspace.name) {
            const workspacePath = workspace.path;

            if (!workspacePath) {
                console.error(`[StopTerminal] ERROR: No workspace path provided for ${workspace.name}. Cleanup may fail.`);
            }

            let socket: any = null;
            let activeSession: any = null;
            let activeSessionId: string | null = null;

            // Find session first to enable logging
            for (const [id, session] of activeTerminals.entries()) {
                if (session.workspaceName === workspace.name) {
                    socket = session.socket;
                    activeSession = session;
                    activeSessionId = id;
                    break;
                }
            }

            const log = (msg: string) => {
                console.log(`[StopTerminal] ${msg}`);
                if (activeSession && activeSession.socket && activeSession.socket.connected) {
                    activeSession.socket.emit('terminal:log', `\r\n\x1b[33m[System] ${msg}\x1b[0m\r\n`);
                }
            };

            if (activeSession) {
                log("Stopping workspace resources...");
            }

            // 1. Check for runtime.json and stop docker if needed
            if (workspacePath && await fs.pathExists(path.join(workspacePath, '.runtime.json'))) {
                try {
                    log("Checking/Stopping Docker containers...");
                    
                    const runtimeConfig = await fs.readJSON(path.join(workspacePath, '.runtime.json'));
                    
                    // Handle array of containers (New Format)
                    if (runtimeConfig && runtimeConfig.containerIds && Array.isArray(runtimeConfig.containerIds)) {
                        log(`Stopping ${runtimeConfig.containerIds.length} Docker containers...`);
                        await stopDockerContainers(runtimeConfig.containerIds);
                        log("All Docker containers stopped and removed.");
                    } 
                    // Handle single container (Legacy Format)
                    else if (runtimeConfig && runtimeConfig.containerId) {
                        await stopDockerContainers([runtimeConfig.containerId]);
                        log("Docker container stopped and removed.");
                    } else {
                        log("No active container ID found in config.");
                    }
                } catch (e: any) {
                    console.error('[StopTerminal] Error stopping docker:', e);
                    log(`Error stopping Docker: ${e.message}`);
                }
            }

            // 2. Run npm run stop in the workspace directory
            if (workspacePath) {
                try {
                    log("Running npm run stop...");
                    // Use execa with shell to ensure proper command execution
                    await execa('npm', ['run', 'stop'], { 
                        cwd: workspacePath,
                        shell: true,
                        reject: false // Don't throw on non-zero exit
                    });
                    log("npm run stop executed.");
                } catch (e: any) {
                    // Script might not exist, that's okay
                    log(`npm run stop not available or failed (this is okay): ${e.message}`);
                }
            }

            // 3. Stop process tree
            let stopped = false;

            if (activeSession && activeSessionId) {
                const currentProcess = activeSession.child;
                if (currentProcess && currentProcess.pid) {
                    log(`Killing process tree for PID ${currentProcess.pid}...`);
                    
                    try {
                        await killProcessTree(currentProcess.pid, 'SIGKILL');
                        log("Process tree killed successfully.");
                    } catch (e: any) {
                        console.error('[StopTerminal] Error killing process tree:', e);
                        log(`Error killing process tree: ${e.message}`);
                    }
                }

                // Clean up terminal session
                stopTerminalProcessInternal(activeSessionId);
                stopped = true;
                
                log("Terminal session cleaned up.");
            }

            // 4. Give system time to fully clean up
            // Port cleanup is handled automatically by tree-kill
            await new Promise(resolve => setTimeout(resolve, 500));

            if (stopped) {
                res.json({ success: true, message: `Terminated process and freed resources for workspace ${workspace.name}` });
            } else {
                res.json({ success: true, message: `Cleanup performed for workspace ${workspace.name} (no active terminal found)` });
            }
            return;
        }

        if (socketId) {
            const stopped = stopTerminalProcessInternal(socketId);
            if (stopped) {
                res.json({ success: true, message: `Terminated process for socket ${socketId}` });
            } else {
                res.json({ success: true, message: `No active terminal process found for socket ${socketId} (already stopped)` });
            }
            return;
        }

        res.status(400).json({ message: 'Missing socketId or workspace.name' });
    
    } catch (err: any) {
        console.error("[StopTerminal] Unexpected Error:", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

export default router;
