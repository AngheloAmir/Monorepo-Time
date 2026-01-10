import { useRef, useState, useEffect } from "react";
import type { WorkspaceItem } from "../_context/workspace";
import config from "config";
import { io, Socket } from "socket.io-client";
import useWorkspaceState from "../_context/workspace";
import apiRoute from "apiroute";

export default function WorkspaceCard(props: WorkspaceItem) {
    const socketRef = useRef<Socket | null>(null);
    const WriteConsole                  = useWorkspaceState.use.writeOnConsole();
    const clearConsole                  = useWorkspaceState.use.clearConsole();
    const setWorkSpaceRunningAs         = useWorkspaceState.use.setWorkSpaceRunningAs();
    const setActiveTerminal             = useWorkspaceState.use.setActiveTerminal();
    const setActiveWorkspaceOptionModal = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const loadingWorkspace              = useWorkspaceState.use.loadingWorkspace();
    const [loading, setLoading]         = useState(false);

    //if loadingWorkspace is this workspace, then show loading
    useEffect(() => {
        if (loadingWorkspace == props.info.name) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [loadingWorkspace]);
    
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                WriteConsole(props.info.name, "Terminal Disconnected");
            }
        };
    }, []);

    const connectAndRun = (runas: 'dev' | 'start') => {
        if(loading) return;
        try {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);

            const port = config.apiPort || 3000;
            
            if (!socketRef.current || !socketRef.current.connected) {
                socketRef.current = io(`http://localhost:${port}`, {
                    transports: ['websocket']
                });

                socketRef.current.on("connect", () => {
                    setWorkSpaceRunningAs(props.info.name, runas);
                    setActiveTerminal(props.info.name);
                    socketRef.current?.emit('run', {
                        workspace: props.info,
                        runas: runas
                    });

                    socketRef.current?.on("log", (data) => {
                        WriteConsole(props.info.name, data);
                    });

                    socketRef.current?.on("error", (data) => {
                        WriteConsole(props.info.name, data);
                    });

                    socketRef.current?.on("exit", (data) => {
                        WriteConsole(props.info.name, data);
                    });

                    socketRef.current?.on("disconnect", () => {
                        WriteConsole(props.info.name, "Disconnected");
                    });
                });
            } else {
                 setWorkSpaceRunningAs(props.info.name, runas);
                 setActiveTerminal(props.info.name);
                 socketRef.current.emit('run', {
                    workspace: props.info,
                    runas: runas
                });
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    async function handleStop() {
        if(loading) return;
        try {
            setLoading(true);
            WriteConsole(props.info.name, "..");

            await fetch(`http://localhost:${config.apiPort}/${apiRoute.stopProcess}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ workspace: props.info })
            });
            setWorkSpaceRunningAs(props.info.name, null);
            setLoading(false);
            
            clearConsole(props.info.name);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-800 border border-gray-700 overflow-hidden flex flex-col">
            <header className="p-2 flex-1 flex gap-4">
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
                <button onClick={() => setActiveWorkspaceOptionModal(props.info)} className="flex-none w-10 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium flex items-center justify-center" title="Options">
                    <i className="fas fa-cog"></i>
                </button>

                <div className="flex-1 flex gap-2">
                    { loading && (
                        <button  className="flex-1 py-1 px-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors shadow-lg shadow-gray-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-spinner animate-spin text-lg"></i>
                            Loading
                        </button>
                    )}
                    { !loading && props.isRunningAs == 'start' && (
                        <button onClick={handleStop}  className="flex-1 py-1 px-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-check-circle text-lg"></i>
                            Server is up
                        </button>
                    )}
                    { !loading && props.isRunningAs == 'dev' && (
                        <button onClick={() => handleStop()} className="flex-1 py-1 px-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-stop text-lg"></i>
                            Stop Dev
                        </button>
                    )}
                    { !loading && props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.info.startCommand && (
                        <button onClick={() => connectAndRun('start')} className="flex-1 py-1 px-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors shadow-lg shadow-green-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-play text-lg"></i>
                            Start
                        </button>
                    )}
                    { !loading && props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.info.devCommand && (
                        <button onClick={() => connectAndRun('dev')} className="flex-1 py-1 px-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-play text-lg"></i>
                            Start Dev
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}