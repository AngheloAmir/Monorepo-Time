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
    const [output, setOutput]       = useState("");
    const [inputText, setInputText] = useState("");
    const [processActive, setProcessActive] = useState(false);
    
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (showNewTerminalWindow) {
            const firstLine  = `\x1b[34m[PATH]\x1b[0m \x1b[32m${showNewTerminalWindow?.path}\x1b[0m`;
            const secondLine = `\x1b[34m[SYSTEM]\x1b[0m Please enter your command prompt.`;
            const thirdLine  = `\x1b[34m[SYSTEM]\x1b[0m Example: npm install nodemon -D`;
            setOutput(`${firstLine}\n${secondLine}\n${thirdLine}`);

            // Initialize socket connection
            const port = config.apiPort || 3000;
            socketRef.current = io(`http://localhost:${port}`, {
                transports: ['websocket']
            });

            socketRef.current.on('connect', () => {
                // Connection established, ready for commands
            });

            socketRef.current.on('terminal:log', (data: string) => {
                setOutput(prev => prev + data);
            });

            socketRef.current.on('terminal:error', (data: string) => {
                 setOutput(prev => prev + `\x1b[31m${data}\x1b[0m`);
            });

            socketRef.current.on('terminal:exit', (code: number) => {
                setProcessActive(false);
                if (code === 0) {
                     setOutput(prev => prev + `\n\x1b[32mCommand finished successfully.\x1b[0m\n`);
                } else {
                     setOutput(prev => prev + `\n\x1b[31mCommand failed with exit code ${code}.\x1b[0m\n`);
                }
                // We don't close the socket here automatically to allow user to read output, 
                // but the process on backend is killed. User can close modal or run another command?
                // The requirements say: "WAIT for another user input to execute."
                // So we stay open.
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [showNewTerminalWindow]);

    const close = () => {
        setShowNewTerminalWindow(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inputText) return;

        const userInput = inputText;
        setInputText("");

        if (!socketRef.current) return;

        // If process is NOT active, treat input as a new command to start
        if (!processActive) {
            setOutput(prev => prev + `\n\x1b[33m$ ${userInput}\x1b[0m\n`);
            setProcessActive(true);
            socketRef.current.emit('terminal:start', {
                workspace: showNewTerminalWindow,
                command: userInput
            });
        } 
        // If process IS active, treat input as stdin for the running process
        else {
             // Echo input to console (optional, but good for feedback)
             setOutput(prev => prev + `${userInput}\n`);
             socketRef.current.emit('terminal:input', userInput);
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

            <div className="flex-1 overflow-y-auto p-3">
                <Console
                    consoleOutput={output}
                    show={true}
                />
            </div>

            <form onSubmit={handleSubmit} className="flex-none flex gap-4 w-full p-2">
                <input 
                    type="text" 
                    className="w-full h-8 p-1 rounded-md border border-gray-600 bg-gray-900 text-gray-100 focus:outline-none focus:border-blue-500" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={processActive ? "Type input..." : "Enter command..."}
                    autoFocus
                />
                <button type="button" onClick={close} className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-1 rounded-md">Close</button>
            </form>
        </ModalBody>
    );
}