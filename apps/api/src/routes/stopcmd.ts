import { Request, Response, Router } from "express";
import { activeProcesses, sockets } from "./runcmddev";
import { WorkspaceInfo } from "types";
import { spawn } from "child_process";
import chalk from "chalk";

const router = Router();

interface RequestBody {
    workspace: WorkspaceInfo;
}

router.post("/", async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");

    try {
        const body = req.body as RequestBody;
        const workspace = body.workspace;

        if (!workspace) {
            return res.status(400).json({ error: "No workspace provided" });
        }

        const currentSocket = sockets.get(workspace.name);
        const currentProcess = activeProcesses.get(workspace.name);

        // 1. Kill the Active Process
        if (currentProcess) {
            currentSocket?.emit('log', chalk.yellow("Stopping active process..."));

            await new Promise<void>((resolve) => {
                let resolved = false;
                const safeResolve = () => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                };

                // Timeout safety: Proceed after 5s if process hangs
                const timer = setTimeout(() => {
                    console.log(`Process stop timed out for ${workspace.name}`);
                    safeResolve();
                }, 5000);

                currentProcess.once('exit', () => {
                    clearTimeout(timer);
                    safeResolve();
                });

                if (currentProcess.pid) {
                    try {
                        if (process.platform !== 'win32') {
                            process.kill(-currentProcess.pid, 'SIGINT');
                        } else {
                            currentProcess.kill();
                        }
                    } catch (error: any) {
                        if (error.code === 'ESRCH') {
                            // Process already dead
                            clearTimeout(timer);
                            safeResolve();
                        } else {
                            console.error(`Failed to kill process: ${error.message}`);
                            // Don't resolve here, wait for timeout or natural exit if signal worked partially
                        }
                    }
                } else {
                    safeResolve();
                }
            });

            activeProcesses.delete(workspace.name);
        } else {
            currentSocket?.emit('log', chalk.yellow("No active process found to stop."));
        }

        // 2. Execute Stop Command (if any)
        const commandToRun = workspace.stopCommand;
        if (commandToRun) {
            currentSocket?.emit('log', chalk.green(`Running stop command: ${commandToRun}`));

            const baseCMD = commandToRun.split(" ")[0];
            const args = commandToRun.split(" ").slice(1);

            const child = spawn(baseCMD, args, {
                cwd: workspace.path,
                env: {
                    ...process.env,
                    TERM: 'dumb',
                    FORCE_COLOR: '1',
                },
                stdio: ['ignore', 'pipe', 'pipe'],
                shell: true,
                detached: process.platform !== 'win32'
            });

            child.stdout.on('data', (data) => {
                currentSocket?.emit('log', data.toString());
            });
            child.stderr.on('data', (data) => {
                currentSocket?.emit('error', data.toString());
            });
            child.on('close', (code) => {
                currentSocket?.emit('log', chalk.green(`Stop command finished with code ${code}`));
                currentSocket?.emit('exit', 'Process stopped');
                // We keep the socket open or let client disconnect
            });

        } else {
            currentSocket?.emit('log', "Process stopped (no stop command defined).");
            currentSocket?.emit('exit', 'Process stopped');
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        res.end();

    } catch (e: any) {
        console.error("Error in stopcmd:", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;


