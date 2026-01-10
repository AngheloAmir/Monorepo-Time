import { useEffect, useState } from "react";
import useWorkspaceState from "../_context/workspace"
import TabTerminal from "../components/workspace/TabTerminal";
import WorkspaceCard from "../components/workspace/WorkSpaceCard";
import WorkspaceOptionModal from "../components/workspace/WorkspaceOptionModal";
import WorkspaceNew from "../components/workspace/WorkspaceNew";
import ModalTerminal from "../components/workspace/ModalTerminal";
import config   from "config";
import apiRoute from "apiroute";
import useAppState from "../_context/app";

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
    const setShowTerminal     = useAppState.use.setShowTerminal();
    const [filesShow, setFilesShow] = useState(true);

    useEffect(() => {
        if (!window.isWorkSpaceLoaded) {
            window.isWorkSpaceLoaded = true;
            loadWorkspace();
        }
    }, []);

    async function showHideFiles() {
        try {
            //count the number of running workspace
            let pathInclude: string[] = [];
            const runningWorkspace = workspace.filter((item) => item.isRunningAs != null);
            const runningCount     = runningWorkspace.length;

            //return list of workspace that is not running
            if (runningCount > 0) {
                pathInclude = workspace.filter((item) => item.isRunningAs == null).map((item) => item.info.path);
            }

            const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.hideShowFileFolder}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hide:       filesShow,
                    pathInclude: pathInclude
                }),
            });
            const data = await response.json();
            if( data.isHidden ) {
                setFilesShow( false );
            } else {
                setFilesShow( true );
            }

        } catch (error) {
            console.error('Error toggling files visibility:', error);
        }
    }

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

            <button
                onClick={() => setShowTerminal(true)}
                className="p-2 pt-3 fixed bottom-44 right-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-110 flex items-center gap-2 z-50 group">
                <i className="w-8 h-8 fa-solid fa-terminal text-xl"></i>
                <span className="font-medium pr-2 hidden group-hover:inline-block transition-all duration-300 whitespace-nowrap overflow-hidden">
                    Root Terminal
                </span>
            </button>

            <button
                onClick={showHideFiles}
                className={ `p-2 pt-3 fixed bottom-26 right-8  ${filesShow ? 'bg-blue-600 hover:bg-blue-500 ' : 'bg-green-600 hover:bg-green-500 ' }text-white rounded-full  shadow-lg shadow-blue-600/30 transition-all hover:scale-110 flex items-center gap-2 z-50 group `}>
                { filesShow ?
                    <i className="w-8 h-8 fa-solid fa-eye-slash text-xl"></i> 
                    :   
                    <i className="w-8 h-8 fa-solid fa-eye text-xl"></i>
                }
                <span className="font-medium pr-2 hidden group-hover:inline-block transition-all duration-300 whitespace-nowrap overflow-hidden">
                    {filesShow ? 'Hide Files' : 'Show Files'}</span>
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

