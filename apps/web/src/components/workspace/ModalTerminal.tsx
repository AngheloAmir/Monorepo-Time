import { useEffect, useRef } from "react";
import useWorkspaceState from "../../_context/workspace";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../InteractiveTerminal";

export default function ModalTerminal() {
    const showNewTerminalWindow = useWorkspaceState.use.showNewTerminalWindow();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const terminalRef     = useRef<InteractiveTerminalRef>(null);

    const close = () => {
        if (terminalRef.current) {
            terminalRef.current.disconnect();
        }
        setShowNewTerminalWindow(null);
    };

    useEffect(() => {
        if (showNewTerminalWindow && terminalRef.current) {
            const timeoutId = setTimeout(() => {
                terminalRef.current?.connect(showNewTerminalWindow.path, "bash", showNewTerminalWindow.name);
                terminalRef.current?.focus();
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [showNewTerminalWindow]);

    if (!showNewTerminalWindow) return null;
    return (
        <ModalBody>
            <ModalHeader
                close={close}
                title={showNewTerminalWindow.name || ""}
                description={showNewTerminalWindow.description || ""}
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
    );
}