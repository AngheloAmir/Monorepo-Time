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
                            <button  className="flex-1 py-1 px-2 rounded-lg bg-gray-800 text-gray-400 border border-white/5 text-xs font-medium flex items-center justify-center gap-2 cursor-wait">
                                <i className="fas fa-spinner animate-spin"></i>
                                Loading...
                            </button>
                        )}
                        { !loading && props.isRunningAs == 'start' && (
                            <button 
                                onClick={ async () => {
                                    await stopInteractiveTerminal(props.info.name);
                                    setWorkSpaceRunningAs(props.info.name, null);
                                }}
                                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-[0_0_10px_-4px_rgba(16,185,129,0.3)] text-xs font-bold flex items-center justify-center gap-2">
                                <i className="fas fa-check-circle"></i>
                                Online
                            </button>
                        )}
                        { !loading && props.isRunningAs == 'dev' && (
                            <button 
                                onClick={async () => {
                                    await stopInteractiveTerminal(props.info.name);
                                    setWorkSpaceRunningAs(props.info.name, null);
                                }}
                                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all shadow-[0_0_10px_-4px_rgba(245,158,11,0.3)] text-xs font-bold flex items-center justify-center gap-2">
                                <i className="fas fa-stop"></i>
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
                                className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all text-xs font-medium flex items-center justify-center gap-2">
                                <i className="fas fa-play text-[10px]"></i>
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
                                className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all text-xs font-bold flex items-center justify-center gap-2 border border-transparent">
                                <i className="fas fa-code text-[10px]"></i>
                                Dev
                            </button>
                        )}

                        {/* CRASHED  */}
                        { !loading && props.isRunningAs == 'crashed' && (
                            <button 
                                onClick={async () => {
                                    stopInteractiveTerminal(props.info.name, true);
                                    setWorkSpaceRunningAs(props.info.name, null);
                                }}
                                className="flex-1 py-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/40 transition-all shadow-[0_0_10px_-4px_rgba(239,68,68,0.3)] text-xs font-bold flex items-center justify-center gap-2">
                                <i className="fas fa-exclamation-triangle"></i>
                                Crashed
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}