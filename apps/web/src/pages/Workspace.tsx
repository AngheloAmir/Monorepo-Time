import { useEffect } from "react";
import type { WorkspaceItem } from "../_context/workspace"
import useWorkspaceState from "../_context/workspace"
import TabTerminal from "../components/TabTerminal";

interface WorkspaceProps {
    isVisible: boolean
}

export default function Workspace(props: WorkspaceProps) {
    const workspace = useWorkspaceState.use.workspace();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();

    useEffect(() => {
        loadWorkspace();
    }, []);

    if (!props.isVisible) return null;
    return (
        <div className="flex-col gap-3 h-full">
            <div id="workspaceContainer" className="overflow-y-scroll flex flex-col gap-3 p-4 w-full h-[calc(100vh-350px)]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {workspace.map((item, index) => {
                        if (item.isRunningAs == 'dev' || item.isRunningAs == 'start') {
                            return (
                                <WorkspaceCard key={index} {...item} />
                            )
                        }
                        return null;
                    })}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {workspace.map((item, index) => {
                        if (!item.isRunningAs) {
                            return (
                                <WorkspaceCard key={index} {...item} />
                            )
                        }
                        return null;
                    })}
                </div>
            </div>

            <div className="flex-1 flex w-full h-full">
                <TabTerminal />
            </div>
        </div >
    )
}

function WorkspaceCard(props: WorkspaceItem) {
    return (
        <div className="bg-gray-800 border border-gray-700 overflow-hidden flex flex-col">
            <header className="p-3 flex-1 flex gap-4">
                <i className={`${props.info.fontawesomeIcon ?? 'fa fa-cube'} text-blue-400 text-3xl`}></i>
                <div className="flex flex-col h-10 overflow-hidden">
                    <h3 className="text-base font-bold text-white leading-tight mb-0.5 ">
                        {props.info.name}
                    </h3>
                    <p className="text-gray-400 text-[14px] truncate">
                        {props.info.description}
                    </p>
                </div>
            </header>

            <div className="p-3 bg-gray-900/30 border-t border-gray-800 flex gap-2 relative">
                <button className="flex-none w-10 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium flex items-center justify-center" title="Options">
                    <i className="fas fa-cog"></i>
                </button>

                <div className="flex-1 flex gap-2">
                    {props.isRunningAs == 'start' && (
                        <button className="flex-1 py-2 px-3 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-check-circle text-lg"></i>
                            Server is up
                        </button>
                    )}
                    {props.isRunningAs == 'dev' && (
                        <button className="flex-1 py-2 px-3 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-stop text-lg"></i>
                            Stop Dev
                        </button>
                    )}
                    {props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.info.startCommand && (
                        <button className="flex-1 py-2 px-3 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors shadow-lg shadow-green-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-play text-lg"></i>
                            Start
                        </button>
                    )}
                    {props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.info.devCommand && (
                        <button className="flex-1 py-2 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-play text-lg"></i>
                            Start Dev
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}