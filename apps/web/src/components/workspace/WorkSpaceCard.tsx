import { useState, useEffect } from "react";
import type { WorkspaceItem } from "../../_context/workspace";
import useWorkspaceState from "../../_context/workspace";

export default function WorkspaceCard(props: WorkspaceItem) {
    const setWorkSpaceRunningAs         = useWorkspaceState.use.setWorkSpaceRunningAs();
    const setActiveTerminal             = useWorkspaceState.use.setActiveTerminal();
    const setActiveWorkspaceOptionModal = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const setShowNewTerminalWindow      = useWorkspaceState.use.setShowNewTerminalWindow();
    const stopInteractiveTerminal       = useWorkspaceState.use.stopInteractiveTerminal();
    const loadingWorkspace              = useWorkspaceState.use.loadingWorkspace();
    const [loading, setLoading]         = useState(false);

    useEffect(() => {
        if (loadingWorkspace == props.info.name) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [loadingWorkspace]);
    
    return (
        <div className="bg-gray-800 rounded-lg transition-all overflow-hidden flex flex-col">
            <header className="p-2 flex-1 flex gap-4 items-center">
                <i className={`${props.info.fontawesomeIcon ?? 'fa fa-cube'} text-blue-400 text-3xl`}></i>
                <div className="flex flex-col h-10 overflow-hidden flex-1">
                    <h3 className="text-base font-bold text-white leading-tight mb-0.5 ">
                        {props.info.name}
                    </h3>
                    <p className="text-gray-400 text-[14px] truncate">
                        {props.info.description}
                    </p>
                </div>
                
                <button 
                    onClick={() => setShowNewTerminalWindow(props.info)} 
                    className="text-gray-500 hover:text-white" >
                    <i className="fas fa-terminal text-sm"></i>
                </button>
            </header>

            <div className="p-3 bg-gray-900/30 border-t border-gray-800 flex gap-2 relative">
                <button 
                    onClick={() => setActiveWorkspaceOptionModal(props.info)}
                    className="group flex-none w-10 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium flex items-center justify-center" title="Options">
                    <i className="fas fa-cog group-hover:text-white group-hover:rotate-90 transition-transform duration-300"></i>
                </button>

                <div className="flex-1 flex gap-2">
                    { loading && (
                        <button  className="flex-1 py-1 px-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors shadow-lg shadow-gray-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-spinner animate-spin text-lg"></i>
                            Loading
                        </button>
                    )}
                    { !loading && props.isRunningAs == 'start' && (
                        <button 
                            onClick={ async () => {
                                await stopInteractiveTerminal(props.info.name);
                                setWorkSpaceRunningAs(props.info.name, null);
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-orange-700 text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="opacity-70 fas fa-check-circle text-lg"></i>
                            Server is up
                        </button>
                    )}
                    { !loading && props.isRunningAs == 'dev' && (
                        <button 
                            onClick={async () => {
                                await stopInteractiveTerminal(props.info.name);
                                setWorkSpaceRunningAs(props.info.name, null);
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-red-800 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="opacity-70 fas fa-stop text-lg"></i>
                            Stop Dev
                        </button>
                    )}
                    { !loading && props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.isRunningAs != 'crashed' && props.info.startCommand && (
                        <button 
                            onClick={() => {
                                setLoading(true);
                                setWorkSpaceRunningAs(props.info.name, 'start');
                                setActiveTerminal(props.info.name);
                                setTimeout(() => setLoading(false), 1000);
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-green-800 text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="opacity-70 fas fa-play text-lg"></i>
                            Start
                        </button>
                    )}
                    
                    { !loading && props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.isRunningAs != 'crashed' && props.info.devCommand && (
                        <button 
                            onClick={() => {
                                setLoading(true);
                                setWorkSpaceRunningAs(props.info.name, 'dev');
                                setActiveTerminal(props.info.name);
                                setTimeout(() => setLoading(false), 1000);
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-blue-800 text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="opacity-70 fas fa-play text-lg"></i>
                            Start Dev
                        </button>
                    )}

                    {/* CRASHED  */}
                    { !loading && props.isRunningAs == 'crashed' && (
                        <button 
                            onClick={async () => {
                                stopInteractiveTerminal(props.info.name, true);
                                setWorkSpaceRunningAs(props.info.name, null);
                            }}
                            className="flex-1 py-1 px-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="opacity-70 fas fa-exclamation-triangle text-lg"></i>
                            Close Terminal
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}