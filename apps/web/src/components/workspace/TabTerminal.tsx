import { useEffect, useRef, useState } from "react";
import useWorkspaceState from "../../_context/workspace";
import Console from "../Console";
import { Terminal } from "xterm";

// Wrapper to sync string-based state (consoleOutput) with stream-based xterm
function TerminalController({ output, visible }: { output: string; visible: boolean }) {
    const terminalRef = useRef<Terminal | null>(null);
    const lastOutputLen = useRef(0);

    useEffect(() => {
        // If terminal not ready, wait
        if (!terminalRef.current) return;

        // Detect if the store was cleared (e.g. user clicked clear)
        if (output.length < lastOutputLen.current) {
            terminalRef.current.reset();
            lastOutputLen.current = 0;
        }

        // Write only the new part of the string
        const newContent = output.slice(lastOutputLen.current);
        if (newContent) {
            terminalRef.current.write(newContent);
            lastOutputLen.current = output.length;
        }
    }, [output]);

    // Force layouts when becoming visible to ensure xterm fits correctly
    useEffect(() => {
        if (visible && terminalRef.current) {
            // Small delay to allow DOM to paint
            setTimeout(() => {
                // Trigger a resize event or re-fit if we had access to addon. 
                // Since Console handles ResizeObserver, just ensuring the div is visible should trigger it.
                // But sometimes manual trigger is needed. Console doesn't expose fit directly but ResizeObserver on div
                // should notice 0x0 -> WxH change.
            }, 10);
        }
    }, [visible]);

    return (
        <div className={`w-full h-full ${visible ? 'block' : 'hidden'}`}>
             <Console terminalRef={terminalRef} />
        </div>
    );
}

export default function TabTerminal() {
    const workspace = useWorkspaceState.use.workspace();
    const activeTerminal = useWorkspaceState.use.activeTerminal();
    const setActiveTerminal = useWorkspaceState.use.setActiveTerminal();

    const stopProcess = useWorkspaceState.use.stopProcess();
    const WriteConsole = useWorkspaceState.use.writeOnConsole();
    const clearConsole = useWorkspaceState.use.clearConsole();
    const setWorkSpaceRunningAs = useWorkspaceState.use.setWorkSpaceRunningAs();
    const [loading, setLoading] = useState(false);

    async function handleStop() {
        if (loading) return;
        try {
            setLoading(true);
            WriteConsole(activeTerminal, "..");
            const currentWorkspace = workspace.find((item) => item.info.name === activeTerminal);
            if (!currentWorkspace) return;

            await stopProcess(activeTerminal);
            setWorkSpaceRunningAs(activeTerminal, null);
            setLoading(false);

            clearConsole(activeTerminal);
            setActiveTerminal('');
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex-none w-full pt-1 flex bg-gray-800 min-h-6 flex-wrap gap-2 select-none">
                {workspace.map((item, index) => {
                    if (item.isRunningAs == 'dev' || item.isRunningAs == 'start')
                        return (
                            <div
                                key={index}
                                onClick={() => setActiveTerminal(item.info.name)}
                                className={`group px-2 w-[200px] gap-2 flex items-center ${activeTerminal === item.info.name ? 'bg-gray-800' : 'mb-1 opacity-60 cursor-pointer bg-gray-700 hover:bg-gray-600'}`}
                            >
                                <div className="flex-1 flex items-center gap-2 truncate overflow-hidden">
                                    <i className={`${item.info.fontawesomeIcon ?? 'fas fa-terminal'} text-blue-500/50 text-[18px] flex-shrink-0`}></i>
                                    <span className="truncate font-medium text-[16px] text-gray-100">
                                        {item.info.name}
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStop();
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>

                        )
                    return null;
                })}
            </header>


            <div className="flex-1 overflow-hidden bg-gray-900 p-2 relative">
                {/* all workspace have active console but are made invisible */}

                {activeTerminal == '' && (
                    <div className="absolute inset-0 flex gap-4 items-center justify-center opacity-40 select-none pointer-events-none">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                            <i className="fas fa-terminal text-md text-gray-600"></i>
                        </div>
                        <span className="text-[16px] text-gray-500">Terminal</span>
                    </div>
                )}

                {workspace.map((item) => (
                    <TerminalController
                        key={item.info.name}
                        output={item.consoleOutput || ""}
                        visible={
                            activeTerminal == item.info.name &&
                            (item.isRunningAs == 'dev' || item.isRunningAs == 'start' || false)
                        }
                    />
                ))}
            </div>
        </div>
    );
}