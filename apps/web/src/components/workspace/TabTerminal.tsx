import useWorkspaceState from "../../appstates/workspace";
import TabTerminalWrapper from "./TabTerminal/TabTerminalWrapper";
import TabTerminalHeaderContainer from "./TabTerminal/TabTerminalHeaderContainer";
import { useState } from "react";

export default function TabTerminal({ whichShow }: { whichShow: string }) {
    const workspace = useWorkspaceState.use.workspace();
    const activeTerminal = useWorkspaceState.use.activeTerminal();
    const [viewMode, setViewMode] = useState<'normal' | 'maximized'>('normal');
    const toggleMaximize = () => {
        setViewMode(v => v === 'maximized' ? 'normal' : 'maximized');
    };

    return (
        <div className={`
            flex flex-col
                ${viewMode === 'maximized' ?
                'absolute inset-0 z-50 w-full h-full bg-[#0a0a0a]' :
                'w-full h-full relative'
            }`}>

            <header className="flex-none w-full pt-1 flex h-9 flex-wrap select-none">
                <button
                    onClick={toggleMaximize}
                    className="w-8 px-2 cursor-pointer select-none rounded-t-md bg-[#0a0a0a]/80 text-gray-500 hover:bg-[#121212] hover:text-gray-300 flex items-center justify-center transition-colors"
                    title={viewMode === 'maximized' ? "Restore" : "Maximize"}
                >
                    <i className={`fas ${viewMode === 'maximized' ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>
                <TabTerminalHeaderContainer whichShow={whichShow} />
            </header>

            <div className={`flex-1 overflow-hidden px-4 py-1 border-t border-gray-900/80 relative`}>
                {(!activeTerminal || !workspace.some(w => w.info.name === activeTerminal && (w.isRunningAs === 'dev' || w.isRunningAs === 'start'))) && (
                    <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-40 select-none pointer-events-none">
                        <div className="w-16 h-16  rounded-full flex items-center justify-center shadow-inner">
                            <i className="fas fa-terminal text-2xl text-gray-600"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-500">Select a running workspace to view terminal</span>
                    </div>
                )}

                {workspace.map((item) => (
                    <TabTerminalWrapper
                        key={item.info.name}
                        workspace={item}
                        visible={   
                            (whichShow === "all"    && activeTerminal == item.info.name && item.isRunningAs != null) ||
                            (whichShow === "apps"   && activeTerminal == item.info.name && item.isRunningAs != null && (item.info.appType === "database" || item.info.appType === undefined)) ||
                            (whichShow === "tools"  && activeTerminal == item.info.name && item.isRunningAs != null && item.info.appType === "tool")
                        }
                    />
                ))}
            </div>
        </div>
    );
}
