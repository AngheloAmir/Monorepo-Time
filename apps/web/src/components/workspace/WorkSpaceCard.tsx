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
        <div className="relative group rounded-xl p-[1px] bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="bg-[#0A0A0A] rounded-[11px] h-full flex flex-col overflow-hidden">
                <header className="p-3 flex items-start gap-4 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                        <i className={`${props.info.fontawesomeIcon ?? 'fa fa-cube'} text-gray-400 group-hover:text-blue-400 text-xl transition-colors`}></i>
                    </div>
                    <div className="flex flex-col h-12 overflow-hidden flex-1">
                        <h3 className="text-base font-bold text-gray-200 group-hover:text-white leading-tight mb-1 transition-colors">
                            {props.info.name}
                        </h3>
                        <p className="text-gray-500 group-hover:text-gray-400 text-xs truncate transition-colors">
                            {props.info.description}
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setShowNewTerminalWindow(props.info)} 
                        className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-blue-600 hover:text-white text-gray-500 flex items-center justify-center transition-colors" >
                        <i className="fas fa-terminal text-xs"></i>
                    </button>
                </header>

                <div className="mt-auto p-3 bg-black/20 border-t border-white/5 flex gap-2 relative">
                    <button 
                        onClick={() => setActiveWorkspaceOptionModal(props.info)}
                        className="group/btn flex-none w-8 h-8 rounded-lg border border-white/10 hover:border-white/30 text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center p-0" title="Options">
                        <i className="fas fa-cog group-hover/btn:rotate-90 transition-transform duration-300 text-xs"></i>
                    </button>

                    <div className="flex-1 flex gap-2">
                        { loading && (
                            <div className="flex-1 py-1.5 px-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 text-xs font-medium flex items-center justify-center gap-2 cursor-wait">
                                <i className="fas fa-spinner animate-spin"></i>
                                Loading...
                            </div>
                        )}
                        { !loading && props.isRunningAs == 'start' && (
                            <button 
                                onClick={ async () => {
                                    await stopInteractiveTerminal(props.info.name);
                                    setWorkSpaceRunningAs(props.info.name, null);
                                }}
                                className="group/btn relative flex-1 py-1.5 px-3 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-20 group-hover/btn:opacity-30 transition-opacity"></div>
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                                <div className="relative z-10 flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                                    <i className="fas fa-check-circle"></i>
                                    Online
                                </div>
                            </button>
                        )}
                        { !loading && props.isRunningAs == 'dev' && (
                            <button 
                                onClick={async () => {
                                    await stopInteractiveTerminal(props.info.name);
                                    setWorkSpaceRunningAs(props.info.name, null);
                                }}
                                className="group/btn relative flex-1 py-1.5 px-3 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_-5px_rgba(245,158,11,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-20 group-hover/btn:opacity-30 transition-opacity"></div>
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-400"></div>
                                <div className="relative z-10 flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                                    <i className="fas fa-stop"></i>
                                    Stop Dev
                                </div>
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
                                className="group/btn relative flex-1 py-1.5 px-3 rounded-lg transition-all duration-300 bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white"
                            >
                                <div className="flex items-center justify-center gap-2 text-xs font-medium">
                                    <i className="fas fa-play text-[10px]"></i>
                                    Start
                                </div>
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
                                className="group/btn relative flex-1 py-1.5 px-3 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-100"></div>
                                <div className="absolute inset-[1px] bg-gray-900 rounded-[7px] group-hover/btn:bg-gray-800 transition-colors"></div>
                                <div className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-xs group-hover/btn:text-blue-100">
                                    <i className="fas fa-code text-[10px]"></i>
                                    Dev
                                </div>
                            </button>
                        )}

                        {/* CRASHED  */}
                        { !loading && props.isRunningAs == 'crashed' && (
                            <button 
                                onClick={async () => {
                                    stopInteractiveTerminal(props.info.name, true);
                                    setWorkSpaceRunningAs(props.info.name, null);
                                }}
                                className="group/btn relative flex-1 py-1.5 px-3 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_-5px_rgba(239,68,68,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-20 group-hover/btn:opacity-30 transition-opacity"></div>
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-500 to-rose-400"></div>
                                <div className="relative z-10 flex items-center justify-center gap-2 text-red-400 font-bold text-xs">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    Crashed
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}