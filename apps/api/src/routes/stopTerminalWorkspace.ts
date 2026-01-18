import { Request, Response, Router } from 'express';
import { activeTerminals, stopTerminalProcess } from './interactiveTerminal';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { socketId, workspace } = req.body;

        if (workspace && workspace.name) {
            // console.log(`[StopTerminal] Request for workspace: ${workspace.name}`);
            
            const workspacePath = workspace.path;
            // console.log(`[StopTerminal] Workspace path provided: ${workspacePath}`);

            if (!workspacePath) {
                 console.error(`[StopTerminal] ERROR: No workspace path provided for ${workspace.name}. Docker cleanup may fail.`);
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
                    if (activeSession) log("Checking/Stopping Docker container...");
                    // console.log(`[StopTerminal] Reading .runtime.json at ${path.join(workspacePath, '.runtime.json')}`);
                    
                    const runtimeConfig = await fs.readJSON(path.join(workspacePath, '.runtime.json'));
                    
                    // Handle array of containers (New Format)
                    if (runtimeConfig && runtimeConfig.containerIds && Array.isArray(runtimeConfig.containerIds)) {
                        console.log(`[StopTerminal] Stopping ${runtimeConfig.containerIds.length} containers...`);
                        activeSession && log(`Stopping ${runtimeConfig.containerIds.length} Docker containers...`);
                        
                        for (const cid of runtimeConfig.containerIds) {
                            try {
                                console.log(`[StopTerminal] Stopping container ${cid}`);
                                await execAsync(`docker stop ${cid}`);
                                console.log(`[StopTerminal] Container ${cid} stopped.`);
                            } catch (e: any) {
                                console.error(`[StopTerminal] Error stopping container ${cid}:`, e);
                                activeSession && log(`Error stopping container ${cid}: ${e.message}`);
                            }
                        }
                        activeSession && log("All Docker containers stopped.");
                    } 
                    // Handle single container (Legacy Format)
                    else if (runtimeConfig && runtimeConfig.containerId) {
                        console.log(`[StopTerminal] Stopping container ${runtimeConfig.containerId}`);
                        await execAsync(`docker stop ${runtimeConfig.containerId}`);
                        console.log(`[StopTerminal] Container stopped.`);
                        if (activeSession) log("Docker container stopped.");
                    } else {
                        // console.log(`[StopTerminal] No containerId found in .runtime.json`);
                        if (activeSession) log("No active container ID found in config.");
                    }
                } catch (e: any) {
                    console.error('[StopTerminal] Error stopping docker:', e);
                    if (activeSession) log(`Error stopping Docker: ${e.message}`);
                }
            } else {
                // console.log(`[StopTerminal] No .runtime.json found at ${workspacePath ? path.join(workspacePath, '.runtime.json') : 'undefined path'}`);
            }

            // 2. npm run stop
            if (workspacePath) {
                try {
                    if (activeSession) log("Running npm run stop...");
                    await execAsync('npm run stop', { cwd: workspacePath });
                    if (activeSession) log("npm run stop executed.");
                } catch (e: any) {
                    // Ignore errors (e.g. if script doesn't exist)
                    // console.error('[StopTerminal] Error running npm run stop:', e);
                    if (activeSession) log(`Error running npm run stop (might not exist): ${e.message}`);
                }
            }

            // 3. Stop process tree
            let stopped = false;

            if (activeSession && activeSessionId) {
                log("Closing terminal in 1 second...");
                await new Promise(resolve => setTimeout(resolve, 1000));

                const currentProcess = activeSession.child;
                if (currentProcess && currentProcess.pid) {
                    if (process.platform === 'win32') {
                        exec(`taskkill /pid ${currentProcess.pid} /T /F`, (err) => {
                            // Ignore error
                        });
                    } else {
                        try {
                            // Kill process group
                            process.kill(-currentProcess.pid, 'SIGKILL');
                        } catch (e: any) {
                            try {
                                currentProcess.kill('SIGKILL');
                            } catch (e2) { }
                        }
                    }
                }

                // Standard cleanup (events, map removal)
                stopTerminalProcess(activeSessionId);
                stopped = true;
            }

            if (stopped) {
                res.json({ success: true, message: `Terminated process for workspace ${workspace.name}` });
            } else {
                // Even if no active terminal session was found (e.g. server restarted), 
                // we likely performed Docker/Switch cleanup. 
                // Wait a bit to give the UI a sense of processing if it was too fast.
                await new Promise(resolve => setTimeout(resolve, 500));
                res.json({ success: true, message: `Cleanup performed for workspace ${workspace.name} (no active terminal found)` });
            }
            return;
        }

        if (socketId) {
            const stopped = stopTerminalProcess(socketId);
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
