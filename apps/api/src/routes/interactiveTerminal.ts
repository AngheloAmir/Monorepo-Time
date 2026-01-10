import { Request, Response, Router } from "express";
import { Server, Socket } from "socket.io";
import { spawn, ChildProcess } from "child_process";
import { WorkspaceInfo } from "types";

const router = Router();

// Keep the router for potential future HTTP endpoints, though we primarily use sockets now
router.get("/", async (req: Request, res: Response) => {
    res.send("Interactive Terminal Route");
});

export default router;

// Map to store active terminal processes for each socket
const activeTerminals = new Map<string, ChildProcess>();

interface StartTerminalPayload {
    workspace: WorkspaceInfo;
    command: string;
}

export function interactiveTerminalSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        
        socket.on('terminal:start', (data: StartTerminalPayload) => {
            const { workspace, command } = data;

            if (activeTerminals.has(socket.id)) {
                socket.emit('terminal:error', 'A process is already running in this terminal.');
                return;
            }

            try {
                const baseCMD = command.split(" ")[0];
                const args = command.split(" ").slice(1);
                
                // Use shell: true to support commands like 'npm' directly
                const child = spawn(baseCMD, args, {
                    cwd: workspace.path,
                    env: {
                        ...process.env,
                        TERM: 'dumb', // Suppress most interactive spinners/animations
                        CI: 'true'    // Further hints to CLI tools to be less interactive/animated
                    },
                    shell: true,
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                activeTerminals.set(socket.id, child);

                socket.emit('terminal:log', `\n$ ${command}\n`);

                child.stdout?.on('data', (chunk) => {
                    socket.emit('terminal:log', chunk.toString());
                });

                child.stderr?.on('data', (chunk) => {
                    // Start 1-10T15... is how npm often outputs. We can just emit log or error.
                    // Stderr is not always an error (e.g. warnings), but let's send it to log for now
                    // or separate event if frontend distinguishes colors.
                    socket.emit('terminal:log', chunk.toString()); 
                });

                child.on('error', (err) => {
                    socket.emit('terminal:error', `Failed to start command: ${err.message}`);
                    cleanup(socket.id);
                });

                child.on('exit', (code) => {
                    if (code !== 0) {
                        socket.emit('terminal:error', `\nProcess exited with code ${code}`);
                    } else {
                        socket.emit('terminal:log', `\nProcess finished successfully.`);
                    }
                    socket.emit('terminal:exit', code);
                    cleanup(socket.id);
                });

            } catch (error: any) {
                socket.emit('terminal:error', `Error handling command: ${error.message}`);
                cleanup(socket.id);
            }
        });

        socket.on('terminal:input', (input: string) => {
            const child = activeTerminals.get(socket.id);
            if (child && child.stdin) {
                // Ensure newline is sent if that's what user expects, 
                // but usually user input from form doesn't have \n.
                // CLI usually expects \n to process line.
                child.stdin.write(input + '\n');
            }
        });

        socket.on('disconnect', () => {
            const child = activeTerminals.get(socket.id);
            if (child) {
                child.kill(); // Kill the process if client disconnects
                activeTerminals.delete(socket.id);
            }
        });

        function cleanup(socketId: string) {
            activeTerminals.delete(socketId);
        }
    });
}
