import { useEffect, useState, useRef } from "react";
import config   from 'config';
import { io, Socket } from "socket.io-client";
import ModalBody from "./workspace/ModalBody";
import ModalHeader from "./workspace/ModalHeader";
import Console from "./Console";
import apiRoute from 'apiroute';
import useAppState from "../_context/app";

export default function RootTerminal() {
    const showTerminal    = useAppState.use.showTerminal();
    const setShowTerminal = useAppState.use.setShowTerminal();
    const [processActive, setProcessActive] = useState(false);
    const [rootPath, setRootPath] = useState<string | null>(null);
    
    // We use a ref to access the xterm instance directly for writing data
    const terminalRef = useRef<any>(null); // Type 'any' or 'Terminal' if available
    const socketRef   = useRef<Socket | null>(null);

    useEffect(() => {
        if (showTerminal) {
            const port = config.apiPort || 3000;
            fetch(`http://localhost:${port}/${apiRoute.getRootPath}`)
                .then(res => res.json())
                .then(data => setRootPath(data.path))
                .catch(err => console.error("Failed to fetch root path", err));
        }
    }, [showTerminal]);

    useEffect(() => {
        if (showTerminal && rootPath) {
            const port = config.apiPort || 3000;
            socketRef.current = io(`http://localhost:${port}`, {
                transports: ['websocket']
            });

            socketRef.current.on('connect', () => {
                const firstLine  = `\x1b[34m[PATH]\x1b[0m \x1b[32m${rootPath}\x1b[0m`;
                const secondLine = `\x1b[34m[SYSTEM]\x1b[0m Root Terminal`;
                const prompt     = `\r\n$ `;
                terminalRef.current?.write(`${firstLine}\r\n${secondLine}${prompt}`);
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
                    terminalRef.current?.write(`\n$ `);
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
    }, [showTerminal, rootPath]);

    const close = () => {
        if(socketRef.current) {
            socketRef.current.disconnect();
        }
        setShowTerminal(false);
    };

    // Buffer to hold current command line input for local echo before sending
    const commandLineBuffer = useRef("");

    const handleTerminalData = (data: string) => {
        if (!processActive) {
            // "Shell" mode emulation
            // We need to implement basic line editing for the 'shell' prompt ($ )
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
            // Ignore other keys (arrows, etc) in this simple shell prompt
        } else {
            // "Interactive" mode: raw passthrough to backend PTY
            // PTY handles echo, so we usually don't echo locally unless PTY is dumb
            // With python pty, it echoes.
            socketRef.current?.emit('terminal:input', data);
        }
    };

    if (!showTerminal) return null;
    return (
        <ModalBody>
            <ModalHeader
                close={close}
                title={"Root Terminal"}
                description={"Execute commands in the project root"}
                icon="fas fa-terminal text-blue-500 text-xl"
            />

            <div className="flex-1 overflow-hidden p-3 bg-gray-900">
                <Console
                    terminalRef={terminalRef}
                    onData={handleTerminalData}
                />
            </div>
        </ModalBody>
    );
}