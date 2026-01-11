import { useState } from "react";
import type { WorkspaceItem } from "../../../_context/workspace";
import useWorkspaceState from "../../../_context/workspace";

interface HeaderItemProps {
    workspace: WorkspaceItem;
}

export default function HeaderItem(props: HeaderItemProps) {
    const setActiveTerminal     = useWorkspaceState.use.setActiveTerminal();
    const stopProcess           = useWorkspaceState.use.stopProcess();
    const setWorkSpaceRunningAs = useWorkspaceState.use.setWorkSpaceRunningAs();
    const [loading, setLoading] = useState(false);
    const activeTerminal = useWorkspaceState.use.activeTerminal();

    async function handleStop() {
        if (loading || !activeTerminal) return;
        try {
            setLoading(true);
            await stopProcess(activeTerminal);
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
            className={`px-3 py-1 w-[160px] gap-2 flex items-center justify-between border-t border-x border-transparent transition-colors ${activeTerminal === props.workspace.info.name
                ? 'bg-gray-900 border-gray-700 text-gray-100'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 cursor-pointer'
                }`}
        >
            <div className="flex items-center gap-2 truncate overflow-hidden">
                <i className={`${props.workspace.info.fontawesomeIcon ?? 'fas fa-terminal'} text-sm ${activeTerminal === props.workspace.info.name ? 'text-blue-400' : 'text-gray-500'}`}></i>
                <span className="truncate font-medium text-xs">
                    {props.workspace.info.name}
                </span>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleStop();
                }}
                className={`w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all ${activeTerminal === props.workspace.info.name ? 'block' : 'hidden'}`}
                title="Stop Process"
            >
                <i className="fa fa-times text-xs"></i>
            </button>
        </div>
    )
}