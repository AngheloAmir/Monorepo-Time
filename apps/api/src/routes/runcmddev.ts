import { spawn, ChildProcess } from "child_process";
import { Server, Socket } from "socket.io";
import { WorkspaceInfo } from "types";

// Keep track of active processes
const activeProcesses = new Map<string, ChildProcess>();

export default function runCmdDevSocket(io: Server, socket: Socket) {
    console.log(`Socket Handler initialized for ${socket.id}`);

    socket.on("run-command", (data: { workspace: WorkspaceInfo, runas: 'dev' | 'start' }) => {
        console.log(`Received run-command:`, data);
        const { workspace, runas } = data;

        if (activeProcesses.has(workspace.name)) {
            console.log(`Process already running for ${workspace.name}`);
            socket.emit("command-error", { 
                workspaceName: workspace.name, 
                message: "Process already running" 
            });
            return;
        }

        const commandToRun = runas === "dev" ? workspace.devCommand : workspace.startCommand;
        
        if (!commandToRun) {
            console.log(`No command to run for ${workspace.name} (runas: ${runas})`);
            socket.emit("command-error", { 
                workspaceName: workspace.name, 
                message: "No command to run" 
            });
            return;
        }

        console.log(`Spawning command: ${commandToRun} in ${workspace.path}`);

        const baseCMD = commandToRun.split(" ")[0];
        const args = commandToRun.split(" ").slice(1);
        
        try {
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

            if (!child.pid) {
                console.error("Failed to spawn process (no PID)");
                 socket.emit("command-error", { 
                    workspaceName: workspace.name, 
                    message: "Failed to spawn process" 
                });
                return;
            }

            console.log(`Child process spawned with PID: ${child.pid}`);
            activeProcesses.set(workspace.name, child);
            socket.emit("process-started", { workspaceName: workspace.name, pid: child.pid });

            child.on('error', (err) => {
                console.error(`Child process error:`, err);
                socket.emit("command-error", {
                     workspaceName: workspace.name,
                     message: `Spawn error: ${err.message}`
                });
            });

            child.stdout?.on("data", (chunk) => {
                const output = chunk.toString();
                // console.log(`stdout: ${output}`); // Optional: too verbose
                socket.emit("command-output", { 
                    workspaceName: workspace.name, 
                    output: output 
                });
            });

            child.stderr?.on("data", (chunk) => {
                const output = chunk.toString();
                console.log(`stderr: ${output}`);
                socket.emit("command-output", { 
                    workspaceName: workspace.name, 
                    output: output,
                    isError: true
                });
            });

            child.on("exit", (code) => {
                activeProcesses.delete(workspace.name);
                socket.emit("process-exit", { 
                    workspaceName: workspace.name, 
                    code 
                });
            });

        } catch (error: any) {
            socket.emit("command-error", { 
                workspaceName: workspace.name, 
                message: error.message 
            });
        }
    });

    // Optional: Allow client to stop the process
    socket.on("stop-command", (data: { workspaceName: string }) => {
        const child = activeProcesses.get(data.workspaceName);
        if (child) {
            child.kill(); 
            // process.kill(-child.pid) if detached/group might be needed for full cleanup
            // but for now simple kill
            activeProcesses.delete(data.workspaceName);
            socket.emit("command-stopped", { workspaceName: data.workspaceName });
        }
    });
}
