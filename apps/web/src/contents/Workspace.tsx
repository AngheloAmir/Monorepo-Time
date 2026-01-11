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

            {/* Root Terminal Button */}
            <button
                onClick={() => setShowTerminal(true)}
                className="group fixed bottom-44 right-8 z-50 flex items-center justify-end"
            >
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center p-[1px] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105">
                     <div className="relative flex items-center bg-[#0A0A0A] rounded-full px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80">
                        <i className="fa-solid fa-terminal text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"></i>
                         <span className="font-bold ml-0 w-0 overflow-hidden group-hover:ml-3 group-hover:w-auto transition-all duration-300 whitespace-nowrap text-white">
                            Root Terminal
                        </span>
                    </div>
                </div>
            </button>

            {/* Show/Hide Files Button */}
            <button
                onClick={showHideFiles}
                className="group fixed bottom-26 right-8 z-50 flex items-center justify-end"
            >
                <div className={`absolute inset-0 ${filesShow ? 'bg-red-500/20' : 'bg-green-500/20'} blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`relative flex items-center p-[1px] rounded-full bg-gradient-to-r ${filesShow ? 'from-red-600 to-pink-600 shadow-red-500/30' : 'from-emerald-600 to-teal-600 shadow-emerald-500/30'} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                     <div className="relative flex items-center bg-[#0A0A0A] rounded-full px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80">
                        { filesShow ?
                            <i className="fa-solid fa-eye-slash text-xl bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-400"></i> 
                            :   
                            <i className="fa-solid fa-eye text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400"></i>
                        }
                         <span className="font-bold ml-0 w-0 overflow-hidden group-hover:ml-3 group-hover:w-auto transition-all duration-300 whitespace-nowrap text-white">
                            {filesShow ? 'Hide Files' : 'Show Files'}
                        </span>
                    </div>
                </div>
            </button>

            {/* Add Workspace Button */}
            <button
                onClick={() => setShowWorkspaceNew(true)}
                className="group fixed bottom-8 right-8 z-50 flex items-center justify-end"
            >
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center p-[1px] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105">
                     <div className="relative flex items-center bg-[#0A0A0A] rounded-full px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80">
                        <i className="fa-solid fa-plus text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"></i>
                         <span className="font-bold ml-0 w-0 overflow-hidden group-hover:ml-3 group-hover:w-auto transition-all duration-300 whitespace-nowrap text-white">
                            Add Workspace
                        </span>
                    </div>
                </div>
            </button>

            <WorkspaceOptionModal />
            <WorkspaceNew />
            <ModalTerminal />
        </div>
    )
}

