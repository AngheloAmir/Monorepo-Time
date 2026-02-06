import { useState } from "react";
import type { WorkspaceItem } from "../../../appstates/workspace";
import useWorkspaceState from "../../../appstates/workspace";

interface HeaderItemProps {
    workspace: WorkspaceItem;
}

export default function HeaderItem(props: HeaderItemProps) {
    const setActiveTerminal     = useWorkspaceState.use.setActiveTerminal();
    const stopWorkspaceTerminal = useWorkspaceState.use.stopWorkspaceTerminal();
    const setWorkSpaceRunningAs = useWorkspaceState.use.setWorkSpaceRunningAs();
    const [loading, setLoading] = useState(false);
    const activeTerminal = useWorkspaceState.use.activeTerminal();
    
    const isActive = activeTerminal === props.workspace.info.name;

    async function handleStop() {
        if (loading || !activeTerminal) return;
        try {
            setLoading(true);
            await stopWorkspaceTerminal(activeTerminal);
            setWorkSpaceRunningAs(activeTerminal, null);
            setLoading(false);
            setActiveTerminal('');
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    return (
        <div
            onClick={() => setActiveTerminal(props.workspace.info.name)}
            className={`
                group relative flex items-center justify-between w-48 w-7 px-3 
                cursor-pointer transition-all duration-300 select-none
                rounded-t-md
                ${isActive 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-[#111] text-gray-500 hover:bg-[#121212] hover:text-gray-300'
                }
            `}
        >
             {/* Gradient Top Highlight for Active State */}
            {/* {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-80" />
            )} */}

            <div className="flex items-center gap-3 overflow-hidden min-w-0">
                {/* Icon Wrapper */}
                <div className={`
                    flex-none w-6 h-6 flex items-center justify-center rounded-md
                    transition-colors duration-300
                    ${isActive ? 'bg-blue-500/10 text-blue-400' : 'bg-transparent text-gray-600 group-hover:text-gray-400'}
                `}>
                     <i className={`${props.workspace.info.fontawesomeIcon ?? 'fas fa-terminal'} text-xs`}></i>
                </div>
                
                <span className="truncate text-xs font-semibold tracking-wide">
                    {props.workspace.info.name}
                </span>
            </div>

            {/* Stop Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleStop();
                }}
                disabled={loading}
                className={`
                    w-6 h-6 flex-none flex items-center justify-center rounded-md 
                    transition-all duration-200
                    ${isActive 
                        ? 'opacity-0 group-hover:opacity-100' 
                        : 'hidden'
                    }
                    ${loading 
                        ? 'text-blue-400 cursor-wait' 
                        : 'text-gray-500 hover:bg-red-500/20 hover:text-red-400'
                    }
                `}
                title="Stop Process"
            >
                <i className={`fas ${loading ? 'fa-circle-notch animate-spin' : 'fa-times'} text-xs`}></i>
            </button>
        </div>
    )
}