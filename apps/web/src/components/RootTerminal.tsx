import {useEffect, useRef } from "react";
import ModalBody from "./ui/ModalBody";
import ModalHeader from "./ui/ModalHeader";
import useAppState from "../_context/app";

import InteractiveTerminal, { type InteractiveTerminalRef } from "./InteractiveTerminal";

export default function RootTerminal() {
    const showTerminal    = useAppState.use.showTerminal();
    const rootDir         = useAppState.use.rootDir();
    const setShowTerminal = useAppState.use.setShowTerminal();
    const terminalRef     = useRef<InteractiveTerminalRef>(null);

    const close = () => {
        if(terminalRef.current) {
            terminalRef.current.disconnect();
        }
        setShowTerminal(false);
    };

    useEffect(() => {
        if (showTerminal && rootDir && terminalRef.current) {
            // Wait slightly for the terminal to be ready in the DOM
            const timeoutId = setTimeout(() => {
                terminalRef.current?.connect(rootDir);
                terminalRef.current?.focus();
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [showTerminal, rootDir]);

    if (!showTerminal) return null;
    return (
       <ModalBody width="700px">
             <ModalHeader
                close={close}
                title={"Root Terminal"}
                description={"Execute commands in the project root"}
                icon="fas fa-terminal text-blue-500 text-xl"
            />
            <div className="flex-1 overflow-hidden p-2">
                <InteractiveTerminal 
                    ref={terminalRef}
                    isInteractive={true}
                    className="h-full"
                />
            </div>
        </ModalBody>
    )
}