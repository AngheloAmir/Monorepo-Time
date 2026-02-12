import {useEffect, useRef } from "react";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";
import useAppState from "../../appstates/app";
import config from 'config';

import InteractiveTerminal, { type InteractiveTerminalRef } from "../lib/InteractiveTerminal";

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
        if(config.useDemo) {
            terminalRef.current?.write("Demo mode is enabled");
            terminalRef.current?.write("Please use it in your local machine");
            terminalRef.current?.write("Visit https://www.npmjs.com/package/monorepotime to know more.");
            return;
        }

        if (showTerminal && rootDir && terminalRef.current) {
            const timeoutId = setTimeout(() => {
                terminalRef.current?.connect(rootDir);
                terminalRef.current?.focus();
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [showTerminal, rootDir]);

    if (!showTerminal) return null;
    return (
       <ModalBody width="800px">
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
                    socketUrl={config.serverPath}
                />
            </div>
        </ModalBody>
    )
}