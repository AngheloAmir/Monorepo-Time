import { Request, Response, Router } from "express";
import { Server, Socket } from "socket.io";
import { spawn, ChildProcess } from "child_process";
import { Writable } from "stream";
import * as pty from "node-pty";

const router = Router();

// Keep the router for potential future HTTP endpoints, though we primarily use sockets now
router.get("/", async (req: Request, res: Response) => {
    res.send("Interactive Terminal Route");
});

export default router;

interface TerminalSession {
    child?: ChildProcess;
    ptyProcess?: pty.IPty;
    workspaceName?: string;
    socket: Socket;
    controlPipe?: Writable;
}

// Map of active terminal sessions, keyed by socket.id
export const activeTerminals = new Map<string, TerminalSession>();

interface StartTerminalPayload {
    path: string;
    command: string;
    workspaceName?: string;
}

/**
 * Manually stops the active opencode terminal process for a specific socket.
 * @returns true if a process was found and stopped, false otherwise.
 */
export function stopTerminalSession(socketId: string): boolean {
    const session = activeTerminals.get(socketId);
    if (session) {
        const { child, ptyProcess, socket } = session;
        
        // Emit closing log before killing
        if (socket.connected) {
            socket.emit('opencode:log', '\r\n\x1b[33m[System] Stopping interactive terminal process...\x1b[0m\r\n');
        }

        // Remove active listeners to prevent side effects during kill
        if (child) {
            child.removeAllListeners();
            child.stdout?.removeAllListeners();
            child.stderr?.removeAllListeners();
            child.kill(); 
        }

        if (ptyProcess) {
            ptyProcess.kill();
        }

        activeTerminals.delete(socketId);
        return true;
    }
    return false;
}

/**
 * Manually stops a terminal process associated with a specific workspace name.
 * @param workspaceName The name of the workspace.
 * @returns true if a process was found and stopped, false otherwise.
 */
export function stopOpencodeTerminalProcessByName(workspaceName: string): boolean {
    let found = false;
    for (const [socketId, session] of activeTerminals.entries()) {
        if (session.workspaceName === workspaceName) {
            stopTerminalSession(socketId);
            found = true;
        }
    }
    return found;
}

export function opencodeTerminalSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        
        socket.on('opencode:start', (data: StartTerminalPayload) => {
            const { path, command, workspaceName } = data;

            // Kill existing process for THIS socket if it exists
            stopTerminalSession(socket.id);

            try {
                const env: NodeJS.ProcessEnv = { ...process.env };
                delete env.CI;
                env.TERM = 'xterm-256color';
                env.FORCE_COLOR = '1';
                
                // Use PROMPT_COMMAND to force the PS1 prompt. 
                env.PROMPT_COMMAND = 'export PS1="\\[\\033[34m\\][PATH] \\[\\033[32m\\]\\w\\[\\033[0m\\]\\n$ ";';

                let child: ChildProcess | undefined;
                let ptyProcess: pty.IPty | undefined;
                let controlPipe: Writable | undefined;

                if (process.platform === 'win32') {
                    // Windows: Use node-pty for full PTY support
                    // We run via cmd.exe /C to ensure we can run command strings (like 'npm run dev') 
                    // and handle PATH resolution correctly, similar to shell: true or bash -c.
                    ptyProcess = pty.spawn('cmd.exe', ['/C', command], {
                        name: 'xterm-256color',
                        cols: 80,
                        rows: 30,
                        cwd: path,
                        env: env as any,
                    });

                    activeTerminals.set(socket.id, { ptyProcess, workspaceName, socket });

                    ptyProcess.onData((data) => {
                         socket.emit('opencode:log', data);
                    });

                    ptyProcess.onExit(({ exitCode }) => {
                         if (exitCode !== 0) {
                             socket.emit('opencode:error', `\r\nProcess exited with code ${exitCode}`);
                         }
                         socket.emit('opencode:exit', exitCode || 0);
                         cleanup(socket.id);
                    });
                } else {
                    // Linux/Mac: Use Python PTY bridge for full interactivity
                    // We use an advanced bridge that listen on a 4th FD (control pipe) for resize events
                    env.CMD = command;
                    const pythonScript = `
import os, pty, sys, select, struct, fcntl, termios, signal

try:
    # 1. Open PTY
    master_fd, slave_fd = pty.openpty()

    # 2. Fork
    pid = os.fork()

    if pid == 0:
        # CHILD
        os.close(master_fd)
        os.setsid()
        os.dup2(slave_fd, 0)
        os.dup2(slave_fd, 1)
        os.dup2(slave_fd, 2)
        if slave_fd > 2:
            os.close(slave_fd)
        
        # Execute command
        cmd = os.environ.get('CMD', 'bash')
        os.execv('/bin/bash', ['/bin/bash', '-c', cmd])

    else:
        # PARENT (Bridge)
        os.close(slave_fd)
        
        # Control pipe is FD 3 (inherited from Node spawn)
        control_fd = 3
        
        try:
            while True:
                # Monitor stdin (0), master_fd, and control_fd (3)
                r, w, x = select.select([0, master_fd, control_fd], [], [])
                
                if master_fd in r:
                    try:
                        data = os.read(master_fd, 10240)
                    except OSError:
                        data = b''
                    if not data: 
                        break # Child closed
                    os.write(1, data) # Write to stdout (1)
                    
                if 0 in r:
                    try:
                        data = os.read(0, 10240)
                    except OSError:
                        data = b''
                    if not data: 
                        break
                    os.write(master_fd, data)
                    
                if control_fd in r:
                    try:
                        data = os.read(control_fd, 1024)
                    except OSError:
                        data = b''
                    if data:
                        try:
                            # Protocol: "rows cols" text
                            parts = data.decode('utf-8', errors='ignore').strip().split()
                            if len(parts) >= 2:
                                rows = int(parts[0])
                                cols = int(parts[1])
                                # TIOCSWINSZ = 0x5414 on Linux generally, but fcntl.TIOCSWINSZ is safer
                                winsize = struct.pack("HHHH", rows, cols, 0, 0)
                                fcntl.ioctl(master_fd, termios.TIOCSWINSZ, winsize)
                                os.kill(pid, signal.SIGWINCH)
                        except:
                            pass
        except Exception:
            pass
        finally:
            os.close(master_fd)
            # Try to cleanup child
            try:
                os.kill(pid, signal.SIGTERM)
                os.waitpid(pid, 0)
            except:
                pass
except Exception as e:
    sys.exit(1)
`;
                    child = spawn('python3', ['-u', '-c', pythonScript], {
                        cwd: path,
                        env: env,
                        stdio: ['pipe', 'pipe', 'pipe', 'pipe'] // Open FD 3
                    });
                    
                    if (child.stdio[3]) {
                        controlPipe = child.stdio[3] as Writable;
                    }
                    
                    activeTerminals.set(socket.id, { child, workspaceName, socket, controlPipe });

                    child.stdout?.on('data', (chunk) => {
                        // Emit to the current socket that started this process
                        socket.emit('opencode:log', chunk.toString());
                    });
    
                    child.stderr?.on('data', (chunk) => {
                        socket.emit('opencode:log', chunk.toString()); 
                    });
    
                    child.on('error', (err: any) => {
                        if (err.code === 'ENOENT' && process.platform !== 'win32') {
                             socket.emit('opencode:error', '\r\n\x1b[31mError: Python3 is required for interactive mode on Linux/Mac but was not found.\x1b[0m');
                        } else {
                             socket.emit('opencode:error', `Failed to start command: ${err.message}`);
                        }
                        cleanup(socket.id);
                    });
    
                    child.on('exit', (code) => {
                        if (code === 127 && process.platform !== 'win32') {
                             socket.emit('opencode:error', '\r\n\x1b[31mError: Python PTY module issue.\x1b[0m');
                        } else if (code !== 0 && code !== null) { // code is null if killed by signal
                            socket.emit('opencode:error', `\r\nProcess exited with code ${code}`);
                        }
                        socket.emit('opencode:exit', code || 0);
                        cleanup(socket.id);
                    });
                }

            } catch (error: any) {
                socket.emit('opencode:error', `Error handling command: ${error.message}`);
                socket.emit('opencode:error', `Error handling command: ${error.message}`);
                cleanup(socket.id);
            }
        });

        socket.on('opencode:input', (input: string) => {
            // Allow input from the socket that owns the terminal
            const session = activeTerminals.get(socket.id);
            if (session) {
                if (session.child && session.child.stdin) {
                    session.child.stdin.write(input);
                } else if (session.ptyProcess) {
                    session.ptyProcess.write(input);
                }
            }
        });

        socket.on('opencode:resize', (data: { cols: number, rows: number }) => {
            const session = activeTerminals.get(socket.id);
            if (session) {
                if (session.controlPipe) {
                    try {
                        // Send "rows cols" to the control pipe
                        session.controlPipe.write(`${data.rows} ${data.cols}`);
                    } catch (e) {
                        // ignore
                    }
                } else if (session.ptyProcess) {
                    try {
                        session.ptyProcess.resize(data.cols, data.rows);
                    } catch (e) {
                        // ignore
                    }
                }
            }
        });

        socket.on('disconnect', () => {
             stopTerminalSession(socket.id);
        });

        function cleanup(socketId: string) {
             activeTerminals.delete(socketId);
        }
    });
}
