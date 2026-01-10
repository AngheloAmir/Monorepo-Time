import useWorkspaceState from "../../_context/workspace";
import Console from "../Console";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { useEffect, useState, useRef } from "react";
import config   from 'config';
import { io, Socket } from "socket.io-client";

const TEMPLATES = [
    { 
        label: "Vite React TS Tailwind", 
        cmd: "npm create vite@latest . -- --template react-ts && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p",
        icon: "fab fa-react text-blue-400"
    },
    { 
        label: "Nodemon Express TS", 
        cmd: "npm init -y && npm install express && npm install -D typescript ts-node nodemon @types/node @types/express && npx tsc --init",
        icon: "fab fa-node-js text-green-500"
    },
    { 
        label: "Next.js TS", 
        cmd: "npx create-next-app@latest . --typescript --tailwind --eslint --no-src-dir --import-alias \"@/*\" --use-npm",
        icon: "fas fa-n text-white" 
    }
];

export default function ModalTerminal() {
    const showNewTerminalWindow = useWorkspaceState.use.showNewTerminalWindow();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const [processActive, setProcessActive] = useState(false);
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    
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

    const runTemplate = (cmd: string) => {
        if (processActive) return;
        
        terminalRef.current?.write(`\r\n\x1b[36m[TEMPLATE]\x1b[0m Executing template...\r\n`);
        
        // We simulate typing the command for better UX, then execute it
        setProcessActive(true);
        socketRef.current?.emit('terminal:start', {
            path: showNewTerminalWindow?.path || "",
            command: cmd
        });
        
        terminalRef.current?.focus();
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

            {/* Template Bar */}
            <div className="relative p-2 bg-gray-800 border-b border-gray-700 flex items-center">
                <button
                    onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                    disabled={processActive}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all
                        ${processActive 
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        }`}
                >
                    <i className="fas fa-magic"></i>
                    <span>Project Templates</span>
                    <i className={`fas fa-chevron-down transition-transform ${isTemplateMenuOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isTemplateMenuOpen && (
                     <>
                        <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsTemplateMenuOpen(false)} 
                        ></div>
                        <div className="absolute top-10 left-2 z-20 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                             <div className="p-2 border-b border-gray-700 bg-gray-800/50">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-2">Select Template</span>
                             </div>
                            {TEMPLATES.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        runTemplate(t.cmd);
                                        setIsTemplateMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-xs text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-3 transition-colors border-b border-gray-700 last:border-0"
                                >
                                    <div className="w-6 text-center">
                                        <i className={`${t.icon} text-sm`}></i>
                                    </div>
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex-1 overflow-hidden p-3 bg-gray-900">
                <Console
                    terminalRef={terminalRef}
                    onData={handleTerminalData}
                />
            </div>
        </ModalBody>
    );
}