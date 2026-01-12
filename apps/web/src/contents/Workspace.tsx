import { useEffect } from "react";
import useWorkspaceState from "../_context/workspace"
import TabTerminal from "../components/workspace/TabTerminal";
import WorkspaceCard from "../components/workspace/WorkSpaceCard";
import WorkspaceOptionModal from "../components/workspace/WorkspaceOptionModal";
import WorkspaceNew from "../components/workspace/WorkspaceNew";
import ModalTerminal from "../components/workspace/ModalTerminal";
import FloatingBtn from "../components/workspace/FloatingBtn";
import GitControl from "../components/workspace/GitControl";

interface WorkspaceProps {
    isVisible: boolean
}

declare global {
    interface Window {
        isWorkSpaceLoaded: boolean;
    }
}

export default function Workspace(props: WorkspaceProps) {
    const workspace           = useWorkspaceState.use.workspace();
    const loadWorkspace       = useWorkspaceState.use.loadWorkspace();

    useEffect(() => {
        if (!window.isWorkSpaceLoaded) {
            window.isWorkSpaceLoaded = true;
            loadWorkspace();
        }
    }, []);

    return (
        <div className={`relative flex flex-col w-full h-[calc(100vh-68px)] ${props.isVisible ? '' : 'hidden'}`}>
            <div className="grid grid-rows-5 h-full min-h-0 gap-2">
                <div className="row-span-3 min-h-0 grid grid-cols-4 gap-2 overflow-hidden">
                    <div className="col-span-3 h-full overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-2">
                        {workspace.map((item) => (
                            <div key={item.info.name}>
                                <WorkspaceCard {...item} />
                            </div>
                        ))}
                    </div>

                    <div className="col-span-1 h-full overflow-hidden">
                        <GitControl />
                    </div>
                </div>

                <div className="row-span-2">
                    <TabTerminal />
                </div>
            </div>

            <FloatingBtn />
            <WorkspaceOptionModal />
            <WorkspaceNew />
            <ModalTerminal />
        </div>
    )
}

