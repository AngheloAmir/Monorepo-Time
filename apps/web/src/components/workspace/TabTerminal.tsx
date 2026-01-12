import useWorkspaceState  from "../../_context/workspace";
import TabTerminalWrapper from "./TabTerminal/TabTerminalWrapper";
import HeaderItem         from "./TabTerminal/HeaderItem";

export default function TabTerminal() {
    const workspace      = useWorkspaceState.use.workspace();
    const activeTerminal = useWorkspaceState.use.activeTerminal();

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex-none w-full pt-1 flex bg-gray-800 min-h-6 flex-wrap select-none px-2">
                {workspace.map((item) => {
                    if (item.isRunningAs != null) 
                        return <HeaderItem key={item.info.name}  workspace={item} />
                })}
            </header>

            <div className="flex-1 overflow-hidden bg-gray-900 p-0 relative">
                {(!activeTerminal || !workspace.some(w => w.info.name === activeTerminal && (w.isRunningAs === 'dev' || w.isRunningAs === 'start'))) && (
                    <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center opacity-40 select-none pointer-events-none">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                            <i className="fas fa-terminal text-2xl text-gray-600"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-500">Select a running workspace to view terminal</span>
                    </div>
                )}

                { workspace.map((item) => (
                    <TabTerminalWrapper
                        key={ item.info.name }
                        workspace={item}
                        visible={
                            activeTerminal == item.info.name && item.isRunningAs != null
                        }
                    />
                ))}
            </div>
        </div>
    );
}
