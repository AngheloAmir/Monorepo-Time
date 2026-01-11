import {useEffect, useRef } from "react";
import ModalBody from "./workspace/ModalBody";
import ModalHeader from "./workspace/ModalHeader";
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
        if (showTerminal) {
            //terminalRef.current?.focus();

            setTimeout(() => {
                terminalRef.current?.write('hello\n')
            }, 1000);
             setTimeout(() => {
                terminalRef.current?.input('git branch')
            }, 2000);
        }
    }, [showTerminal]);

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
                    path={rootDir}
                    onExit={() => setShowTerminal(false)}
                />
            </div>
        </ModalBody>
    )
}