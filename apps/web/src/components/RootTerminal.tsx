import { useEffect, useState, useRef } from "react";
import config   from 'config';
import ModalBody from "./workspace/ModalBody";
import ModalHeader from "./workspace/ModalHeader";
import apiRoute from 'apiroute';
import useAppState from "../_context/app";

import InteractiveTerminal, { type InteractiveTerminalRef } from "./InteractiveTerminal";

export default function RootTerminal() {
    const showTerminal    = useAppState.use.showTerminal();
    const setShowTerminal = useAppState.use.setShowTerminal();
    const [rootPath, setRootPath] = useState<string | null>(null);
    
    // Use the InteractiveTerminalRef
    const terminalRef = useRef<InteractiveTerminalRef>(null);

    // Fetch root path when terminal opens
    useEffect(() => {
        if (showTerminal) {
            const port = config.apiPort || 3000;
            // Only fetch if we haven't already (or fetch every time if you prefer freshness)
            fetch(`http://localhost:${port}/${apiRoute.getRootPath}`)
                .then(res => res.json())
                .then(data => setRootPath(data.path))
                .catch(err => console.error("Failed to fetch root path", err));
        }
    }, [showTerminal]);

    // Connect the terminal when rootPath is available and terminal is shown
    useEffect(() => {
        if (showTerminal && rootPath && terminalRef.current) {
            // Wait a tick for the component to mount/ref to attach if needed, 
            // though useEffect runs after render so ref should be populated.
            // Connect to the root path
            terminalRef.current.connect(rootPath);

            // Optional: Register a close handler if the backend process exits (e.g. typing 'exit')
            terminalRef.current.onClose(() => {
                setShowTerminal(false);
            });
        }
    }, [showTerminal, rootPath]);

    const close = () => {
        if(terminalRef.current) {
            terminalRef.current.disconnect();
        }
        setShowTerminal(false);
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
                <InteractiveTerminal 
                    ref={terminalRef}
                    isInteractive={true}
                    className="h-full"
                />
            </div>
        </ModalBody>
    )
}