import { useEffect } from "react";
import useWorkspaceState from "../_context/workspace"
import TabTerminal from "../components/workspace/TabTerminal";
import WorkspaceCard from "../components/workspace/WorkSpaceCard";
import WorkspaceOptionModal from "../components/workspace/WorkspaceOptionModal";
import WorkspaceNew from "../components/workspace/WorkspaceNew";
import ModalTerminal from "../components/workspace/ModalTerminal";

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
    const setShowWorkspaceNew = useWorkspaceState.use.setShowWorkspaceNew();

    useEffect(() => {
        if (!window.isWorkSpaceLoaded) {
            window.isWorkSpaceLoaded = true;
            loadWorkspace();
        }
    }, []);

    return (
        <div className={`relative flex flex-col w-full h-[calc(100vh-68px)] ${props.isVisible ? '' : 'hidden'}`}>
            <div className="grid grid-rows-5 h-full min-h-0 gap-2">
                <div className="row-span-3 min-h-0 overflow-y-auto flex flex-col gap-3 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {workspace.map((item) => (
                            <div key={item.info.name}>
                                <WorkspaceCard {...item} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row-span-2">
                    <TabTerminal />
                </div>
            </div>

            <button id="vscode-fab-btn"
                className="p-2 pt-3 fixed bottom-26 right-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full  shadow-lg shadow-blue-600/30 transition-all hover:scale-110 flex items-center gap-2 z-50 group">
                <i className="w-8 h-8 fa-solid fa-eye-slash text-xl"></i>
                <span className="font-medium pr-2 hidden group-hover:inline-block transition-all duration-300 whitespace-nowrap overflow-hidden">Hide Files</span>
            </button>

            <button
                onClick={() => setShowWorkspaceNew(true)}
                className="p-2 pt-3 fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-110 flex items-center gap-2 z-50 group">
                <i className="w-8 h-8 fa-solid fa-plus text-xl"></i>
                <span className="font-medium pr-2 hidden group-hover:inline-block transition-all duration-300 whitespace-nowrap overflow-hidden">
                    Add Workspace
                </span>
            </button>

            <WorkspaceOptionModal />
            <WorkspaceNew />
            <ModalTerminal />
        </div>
    )
}

