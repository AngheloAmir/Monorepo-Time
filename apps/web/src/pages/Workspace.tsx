import { useEffect } from "react";
import useWorkspaceState from "../_context/workspace"
import TabTerminal from "../components/TabTerminal";
import WorkspaceCard from "../components/WorkSpaceCard";

interface WorkspaceProps {
    isVisible: boolean
}

declare global {
    interface Window {
        isWorkSpaceLoaded: boolean;
    }
}

export default function Workspace(props: WorkspaceProps) {
    const workspace = useWorkspaceState.use.workspace();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();

    useEffect(() => {
        if (!window.isWorkSpaceLoaded) {
            window.isWorkSpaceLoaded = true;
            loadWorkspace();
        }
    }, []);

    return (
        <div className={`flex flex-col w-full h-[calc(100vh-68px)] ${props.isVisible ? '' : 'hidden'}`}>
            <div className="grid grid-rows-5 h-full min-h-0 gap-2">
                <div className="row-span-3 min-h-0 overflow-y-auto flex flex-col gap-3 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        { workspace.map((item, index) => (
                            <div key={index}>
                                <WorkspaceCard {...item} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row-span-2">
                    <TabTerminal />
                </div>
            </div>
        </div>
    )
}

