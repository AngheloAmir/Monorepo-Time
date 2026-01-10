import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { io, Socket } from "socket.io-client";
import Console from "../Console";
import config from 'config'; 
// @ts-ignore
import apiRoute from 'apiroute'; 

interface TurboConsoleProps {
    rootPath: string | null;
}

export interface TurboConsoleRef {
    runCommand: (cmd: string) => void;
}

const TurboConsole = forwardRef<TurboConsoleRef, TurboConsoleProps>(({ rootPath }, ref) => {
    const terminalRef = useRef<any>(null);
    const socketRef = useRef<Socket | null>(null);
    const [processActive, setProcessActive] = useState(false);
    const commandLineBuffer = useRef("");

    useImperativeHandle(ref, () => ({
        runCommand: (cmd: string) => {
            if (!socketRef.current || !rootPath) return;
            
            // Clear console
            terminalRef.current?.clear(); 
            
            // Write command and execute
            terminalRef.current?.write(`\x1b[32m$ ${cmd}\x1b[0m\r\n`);
            setProcessActive(true);
            socketRef.current.emit('terminal:start', {
                path: rootPath,
                command: cmd
            });
        }
    }));

    useEffect(() => {
        if (rootPath) {
            const port = config.apiPort || 3000;
            socketRef.current = io(`http://localhost:${port}`, {
                transports: ['websocket']
            });

            socketRef.current.on('connect', () => {
                const initMsg = `\x1b[34m[Turbo Console Ready]\x1b[0m\r\n\x1b[30;1mPath: ${rootPath}\x1b[0m\r\n$ `;
                terminalRef.current?.write(initMsg);
            });

            socketRef.current.on('terminal:log', (data: string) => {
                terminalRef.current?.write(data);
            });

            socketRef.current.on('terminal:error', (data: string) => {
                terminalRef.current?.write(`\x1b[31m${data}\x1b[0m`);
            });

            socketRef.current.on('terminal:exit', (code: number) => {
                setProcessActive(false);
                if (code === 0) {
                    terminalRef.current?.write(`\n\x1b[32mSuccess\x1b[0m\r\n$ `);
                } else {
                    terminalRef.current?.write(`\r\n\x1b[31mCommand failed with exit code ${code}.\x1b[0m\r\n$ `);
                }
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [rootPath]);

    const handleTerminalData = (data: string) => {
        if (!processActive) {
            // Shell emulation for local simple inputs
            if (data === '\r') { // Enter
                const cmd = commandLineBuffer.current;
                terminalRef.current?.write('\r\n');
                
                if (cmd.trim()) {
                    setProcessActive(true);
                    socketRef.current?.emit('terminal:start', {
                        path: rootPath || "",
                        command: cmd.trim()
                    });
                } else {
                   terminalRef.current?.write('$ ');
                }
                commandLineBuffer.current = "";
            } else if (data === '\u007F') { // Backspace
                if (commandLineBuffer.current.length > 0) {
                    commandLineBuffer.current = commandLineBuffer.current.slice(0, -1);
                    terminalRef.current?.write('\b \b');
                }
            } else if (data >= ' ' && data <= '~') { // Printable characters
                commandLineBuffer.current += data;
                terminalRef.current?.write(data);
            }
        } else {
            // Interactive mode passthrough
            socketRef.current?.emit('terminal:input', data);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <i className="fas fa-terminal text-gray-400 text-xs"></i>
                    <span className="text-xs font-mono text-gray-400">Terminal Output</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                </div>
            </div>
            <div className="flex-1 min-h-0 relative">
                 <Console terminalRef={terminalRef} onData={handleTerminalData} />
            </div>
        </div>
    );
});

export default TurboConsole;