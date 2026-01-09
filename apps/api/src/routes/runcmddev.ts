import { spawn, ChildProcess } from "child_process";
import { Server, Socket } from "socket.io";
import { WorkspaceInfo } from "types";
import chalk from "chalk";

export const activeProcesses = new Map<string, ChildProcess>();
export const sockets         = new Map<string, Socket>();

interface RequestBody {
    workspace: WorkspaceInfo;
    runas: 'dev' | 'start';
}

export default function runCmdDevSocket(io: Server) {
    io.on('connection', (socket) => {
        socket.on('run', (data: RequestBody) => {
            sockets.set(data.workspace.name, socket);

            try {
                handleOnRun(socket, data);
            } catch (error) {
                socket.emit('error', {
                    message: error
                });
            }
        });
    });
}

async function handleOnRun( socket: Socket, data: RequestBody) {
    const { workspace, runas } = data;

    if (activeProcesses.has(workspace.name)) 
        return socket.emit("log", "Attached to already running process...");
    
    const commandToRun = runas === "dev" ? workspace.devCommand: workspace.startCommand;
    if( !commandToRun ) throw new Error("No command to run");
    const baseCMD      = commandToRun.split(" ")[0];
    const args         = commandToRun.split(" ").slice(1);

    socket.emit('log', chalk.green(`${data.workspace.path}: ${commandToRun}`));
    const child        = spawn(baseCMD, args, {
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
    activeProcesses.set(workspace.name, child);
   
    child.on('error', (error) => {
        socket.emit('error', error.message);
    });

    child.stdout.on('data', (data) => {
        socket.emit('log', data.toString() );
    });

    child.stderr.on('data', (data) => {
        socket.emit('error', data.toString());
    });

    child.on('exit', (code) => {
        socket.emit('exit', `Process exited with code ${code}`);
    });
}
