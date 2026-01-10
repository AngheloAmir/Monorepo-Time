import useWorkspaceState from "../../_context/workspace";
import Console from "../Console";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { useEffect, useState, useRef } from "react";
import config   from 'config';
import { io, Socket } from "socket.io-client";

export default function ModalTerminal() {
    const showNewTerminalWindow = useWorkspaceState.use.showNewTerminalWindow();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const [processActive, setProcessActive] = useState(false);
    
    // We use a ref to access the xterm instance directly for writing data
    const terminalRef = useRef<any>(null); // Type 'any' or 'Terminal' if available
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (showNewTerminalWindow) {
            const port = config.apiPort || 3000;
            socketRef.current = io(`http://localhost:${port}`, {
                transports: ['websocket']
            });

            socketRef.current.on('connect', () => {
                const firstLine  = `\x1b[34m[PATH]\x1b[0m \x1b[32m${showNewTerminalWindow?.path}\x1b[0m`;
                const secondLine = `\x1b[34m[SYSTEM]\x1b[0m Please enter your command prompt.`;
                const thirdLine  = `\x1b[34m[SYSTEM]\x1b[0m Example: npm install nodemon -D`;
                const prompt     = `\r\n$ `;
                terminalRef.current?.write(`${firstLine}\r\n${secondLine}\r\n${thirdLine}${prompt}`);
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
                     terminalRef.current?.write(`\r\n\x1b[32mCommand finished successfully.\x1b[0m\r\n$ `);
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
    }, [showNewTerminalWindow]);

    const close = () => {
        if(socketRef.current) {
            socketRef.current.disconnect();
        }
        setShowNewTerminalWindow(null);
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
                        path: showNewTerminalWindow?.path || "",
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

    if (!showNewTerminalWindow) return null;
    return (
        <ModalBody>
            <ModalHeader
                close={close}
                title={showNewTerminalWindow.name || ""}
                description={showNewTerminalWindow.description || ""}
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