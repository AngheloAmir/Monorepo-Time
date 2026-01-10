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
    path: string;
    command: string;
}

export function interactiveTerminalSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        
        socket.on('terminal:start', (data: StartTerminalPayload) => {
            const { path, command } = data;

            if (activeTerminals.has(socket.id)) {
                const oldChild = activeTerminals.get(socket.id);
                if (oldChild) {
                    // Remove all listeners to prevent 'exit' or 'data' events from the old process
                    // interfering with the new one or sending confusing logs.
                    oldChild.removeAllListeners();
                    oldChild.stdout?.removeAllListeners();
                    oldChild.stderr?.removeAllListeners();
                    
                    oldChild.kill();
                    activeTerminals.delete(socket.id);
                    socket.emit('terminal:log', '\r\n\x1b[33m[System] Previous command terminated.\x1b[0m\r\n');
                }
            }

            try {
                const env: NodeJS.ProcessEnv = { ...process.env };
                delete env.CI;
                env.TERM = 'xterm-256color';
                env.FORCE_COLOR = '1';

                let child: ChildProcess;

                if (process.platform === 'win32') {
                    // Windows does not support the python pty module.
                    // We fall back to standard spawn with shell: true.
                    // Interactivity might be limited (arrow keys might not work in some apps),
                    // but standard input/output should function.
                    socket.emit('terminal:log', '\x1b[33m[System] Windows detected. Running in compatible mode (limited interactivity).\x1b[0m\r\n');
                    
                    const baseCMD = command.split(" ")[0];
                    const args = command.split(" ").slice(1);
                    
                    child = spawn(baseCMD, args, {
                        cwd: path,
                        env: env,
                        shell: true,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                } else {
                    // Linux/Mac: Use Python PTY bridge for full interactivity
                    env.CMD = command;
                    const pythonScript = `
import pty, sys, os

try:
    cmd = os.environ.get('CMD')
    if not cmd:
        sys.exit(1)

    # pty.spawn(argv) executes argv and connects stdin/stdout to pty
    status = pty.spawn(['/bin/bash', '-c', 'stty cols 80 rows 24; ' + cmd])

    if os.WIFEXITED(status):
        sys.exit(os.WEXITSTATUS(status))
    else:
        sys.exit(1)
except ImportError:
    sys.exit(127) # Return special code if pty module missing (unlikely on unix)
except Exception as e:
    sys.exit(1)
`;
                    child = spawn('python3', ['-u', '-c', pythonScript], {
                        cwd: path,
                        env: env,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                }

                activeTerminals.set(socket.id, child);

                child.stdout?.on('data', (chunk) => {
                    socket.emit('terminal:log', chunk.toString());
                });

                child.stderr?.on('data', (chunk) => {
                    socket.emit('terminal:log', chunk.toString()); 
                });

                child.on('error', (err: any) => {
                    if (err.code === 'ENOENT' && process.platform !== 'win32') {
                         socket.emit('terminal:error', '\r\n\x1b[31mError: Python3 is required for interactive mode on Linux/Mac but was not found.\x1b[0m');
                    } else {
                         socket.emit('terminal:error', `Failed to start command: ${err.message}`);
                    }
                    cleanup(socket.id);
                });

                child.on('exit', (code) => {
                    // Check for our custom "Python missing pty" code or general failure logic
                   if (code === 127 && process.platform !== 'win32') {
                         socket.emit('terminal:error', '\r\n\x1b[31mError: Python PTY module issue.\x1b[0m');
                    } else if (code !== 0) {
                        socket.emit('terminal:error', `\r\nProcess exited with code ${code}`);
                    } else {
                        //socket.emit('terminal:log', `\r\nProcess finished successfully.`);
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
