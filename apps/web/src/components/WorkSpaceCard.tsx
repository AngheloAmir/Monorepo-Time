import { useEffect, useRef } from "react";
import type { WorkspaceItem } from "../_context/workspace";
import config   from "config";
import { io, Socket } from "socket.io-client";
import useWorkspaceState from "../_context/workspace";

export default function WorkspaceCard(props: WorkspaceItem) {
    const socketRef    = useRef<Socket | null>(null);
    const WriteConsole          = useWorkspaceState.use.writeOnConsole();
    const setWorkSpaceRunningAs = useWorkspaceState.use.setWorkSpaceRunningAs();

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const connectAndRun = (runas: 'dev' | 'start') => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const url = `http://localhost:${config.apiPort}`;
        console.log('Connecting to:', url);
        const socket      = io(url);
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log('connected');
            setWorkSpaceRunningAs(props.info.name, runas);
            socket.emit('run-command', {
                workspace: props.info,
                runas: runas
            });
        });

        socket.on("command-output", (data) => {
            console.log( data )
            if (data.workspaceName === props.info.name) {
                WriteConsole(props.info.name, data.output);
            }
        });

        socket.on("process-started", (data) => {
            console.log( data )
            if (data.workspaceName === props.info.name) {
                WriteConsole(props.info.name, `Process started for ${data.workspaceName} (PID: ${data.pid})`);
            }
        });

        socket.on("command-error", (data) => {
            console.log( data )
            if (data.workspaceName === props.info.name) {
                WriteConsole(props.info.name, data.output);
            }
        });
        
        socket.on("process-exit", (data) => {
            console.log( data )
            if (data.workspaceName === props.info.name) {
                WriteConsole(props.info.name, `Process exited for ${data.workspaceName} with code ${data.code}`);
                socket.disconnect();
            }
        });
    }

    function handleStop() {
        if (socketRef.current) {
            socketRef.current.emit('stop-command', {
                 workspaceName: props.info.name
            });
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
                <button className="flex-none w-10 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium flex items-center justify-center" title="Options">
                    <i className="fas fa-cog"></i>
                </button>

                <div className="flex-1 flex gap-2">
                    {props.isRunningAs == 'start' && (
                        <button onClick={handleStop} className="flex-1 py-1 px-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-check-circle text-lg"></i>
                            Server is up
                        </button>
                    )}
                    {props.isRunningAs == 'dev' && (
                        <button onClick={handleStop} className="flex-1 py-1 px-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-stop text-lg"></i>
                            Stop Dev
                        </button>
                    )}
                    {props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.info.startCommand && (
                        <button onClick={() => connectAndRun('start')} className="flex-1 py-1 px-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors shadow-lg shadow-green-600/20 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
                            <i className="fas fa-play text-lg"></i>
                            Start
                        </button>
                    )}
                    {props.isRunningAs != 'dev' && props.isRunningAs != 'start' && props.info.devCommand && (
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