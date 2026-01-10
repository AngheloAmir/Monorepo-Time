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
                // Prepare environment: Remove CI to allow interactivity
                // Set TERM to xterm-256color because we are now using xterm.js frontend which supports it
                const env: NodeJS.ProcessEnv = { ...process.env };
                delete env.CI;
                env.TERM = 'xterm-256color';
                env.CMD = command;
                env.FORCE_COLOR = '1';

                // Python script to bridge PTY
                // We use python3 pty module to provide a real TTY
                // We wrap the command in stty to ensure reasonable window size (80x24) to prevent wrapping issues
                const pythonScript = `
import pty, sys, os

cmd = os.environ.get('CMD')
if not cmd:
    sys.exit(1)

# pty.spawn(argv) executes argv and connects stdin/stdout to pty
status = pty.spawn(['/bin/bash', '-c', 'stty cols 80 rows 24; ' + cmd])

if os.WIFEXITED(status):
    sys.exit(os.WEXITSTATUS(status))
else:
    sys.exit(1)
`;
                
                const child = spawn('python3', ['-u', '-c', pythonScript], {
                    cwd: workspace.path,
                    env: env,
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
                // With PTY bridge, we send raw input. PTY handles newlines/signals.
                child.stdin.write(input);
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
