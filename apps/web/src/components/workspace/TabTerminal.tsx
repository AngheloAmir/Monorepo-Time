import useWorkspaceState from "../../appstates/workspace";
import TabTerminalWrapper from "./TabTerminal/TabTerminalWrapper";
import TabTerminalHeaderContainer from "./TabTerminal/TabTerminalHeaderContainer";

export default function TabTerminal({ 
    whichShow, 
    isMaximized, 
    onToggleMaximize 
}: { 
    whichShow: string, 
    isMaximized: boolean, 
    onToggleMaximize: () => void 
}) {
    const workspace      = useWorkspaceState.use.workspace();
    const activeTerminal = useWorkspaceState.use.activeTerminal();

    return (
        <div className="flex flex-col w-full h-full relative ">

            <header className="flex-none w-full pt-1 flex h-9 flex-wrap select-none">
                <button
                    onClick={onToggleMaximize}
                    className="w-8 px-2 cursor-pointer select-none rounded-t-md bg-[#0a0a0a]/80 text-gray-500 hover:bg-[#121212] hover:text-gray-300 flex items-center justify-center transition-colors"
                    title={isMaximized ? "Restore" : "Maximize"}
                >
                    <i className={`fas ${isMaximized ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>
                <TabTerminalHeaderContainer whichShow={whichShow} />
            </header>

            <div className={`flex-1 overflow-hidden px-4 py-1 border-t border-gray-900/80 relative`}>
                {workspace.map((item) => (
                    <TabTerminalWrapper
                        key={item.info.name}
                        workspace={item}
                        visible={   
                            (whichShow === "all" && activeTerminal == item.info.name && item.isRunningAs != null) ||
                            (whichShow === item.info.workspace   && 
                                activeTerminal == item.info.name && 
                                item.isRunningAs != null
                            )
                        }
                    />
                ))}
            </div>
        </div>
    );
}
