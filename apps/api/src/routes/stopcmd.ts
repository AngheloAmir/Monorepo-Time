import { Request, Response, Router } from "express";
import { activeProcesses, sockets } from "./runcmddev";
import { WorkspaceInfo } from "types";
import { spawn, exec } from "child_process";
import { promisify } from "util";
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

            if (currentProcess.pid) {
                if (process.platform !== 'win32') {
                    await cleanupProcessPorts(currentProcess.pid, currentSocket);
                }
            }

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

        // 3. Execute Stop Command (if any)
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

const execAsync = promisify(exec);

async function getProcessTreePids(rootPid: number): Promise<number[]> {
    try {
        // getting all processes with ppid
        const { stdout } = await execAsync('ps -e -o pid,ppid --no-headers');
        const pids = new Set<number>();
        pids.add(rootPid);

        const tree = new Map<number, number[]>();
        const lines = stdout.trim().split('\n');
        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 2) {
                const pid = parseInt(parts[0], 10);
                const ppid = parseInt(parts[1], 10);
                if (!tree.has(ppid)) tree.set(ppid, []);
                tree.get(ppid)?.push(pid);
            }
        }

        const queue = [rootPid];
        while (queue.length > 0) {
            const current = queue.shift()!;
            const children = tree.get(current);
            if (children) {
                for (const child of children) {
                    pids.add(child);
                    queue.push(child);
                }
            }
        }
        return Array.from(pids);
    } catch (e) {
        console.error("Error building process tree:", e);
        return [rootPid];
    }
}

async function cleanupProcessPorts(rootPid: number, socket: any) {
    try {
        const pids = await getProcessTreePids(rootPid);
        
        // lsof output format "-F pn":
        // p1234
        // n*:3000
        const { stdout } = await execAsync('lsof -P -n -iTCP -sTCP:LISTEN -F pn');
        const lines = stdout.trim().split('\n');
        
        let currentPid = -1;
        const pidPorts = new Map<number, string[]>();

        for (const line of lines) {
            const type = line[0];
            const content = line.substring(1);
            if (type === 'p') {
                currentPid = parseInt(content, 10);
            } else if (type === 'n' && currentPid !== -1) {
                const match = content.match(/:(\d+)$/);
                if (match) {
                     const port = match[1];
                     // Only check if this port belongs to one of our tree PIDs
                     if (!pidPorts.has(currentPid)) pidPorts.set(currentPid, []);
                     pidPorts.get(currentPid)?.push(port);
                }
            }
        }

        for (const pid of pids) {
            if (pidPorts.has(pid)) {
                const ports = pidPorts.get(pid);
                if (ports) {
                    for (const port of ports) {
                        socket?.emit('log', chalk.yellow(`Detected active port ${port} on PID ${pid}. Killing port...`));
                        try {
                            await execAsync(`npx -y kill-port ${port}`);
                        } catch (err: any) {
                             socket?.emit('log', chalk.red(`Failed to kill port ${port}: ${err.message}`));
                        }
                    }
                }
            }
        }
    } catch (e) {
        // If lsof fails (e.g. no permissions or no ports open), just ignore
    }
}


