import { useEffect, useState, useMemo } from "react";
import useWorkspaceState, { type WorkspaceItem } from "../../appstates/workspace"
import TabTerminal from "../workspace/TabTerminal";
import WorkspaceCard from "../workspace/WorkSpaceCard";
import WorkspaceOptionModal from "../workspace/WorkspaceOptionModal";
import WorkspaceNew from "../workspace/WorkspaceNew";
import ModalTerminal from "../workspace/ModalTerminal";
import FloatingBtn from "../workspace/FloatingBtn";
import Loading from "../workspace/Loading";
import { WorkspaceTabToggle } from "../workspace/WorkspaceTabToggle";

interface WorkspaceProps {
    isVisible: boolean
}

export default function Workspace(props: WorkspaceProps) {
    const [whichShow, setWhichShow] = useState("all");
    const workspace = useWorkspaceState.use.workspace();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();
    const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceItem[] | null>(null);
    const [isTabTerminalVisible, setIsTabTerminalVisible] = useState(false);
    const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);

    useEffect(() => {
        if (props.isVisible) {
            loadWorkspace();
        }
    }, [props.isVisible]);

    useEffect(() => {
        if (whichShow === "all") {
            setCurrentWorkspace(workspace);
        } else {
            setCurrentWorkspace(workspace.filter((item) => item.info.workspace === whichShow));
        }

        //find if there is running terminal, if so the the terminal is visible
        const runningTerminal = workspace.find((item) => item.isRunningAs != null);
        if (runningTerminal) {
            setIsTabTerminalVisible(true);
        } else {
            setIsTabTerminalVisible(false);
        }
    }, [whichShow, workspace]);

    const groupedWorkspaces = useMemo(() => {
        if (!currentWorkspace) return [];
        const groups: Record<string, WorkspaceItem[]> = {};
        currentWorkspace.forEach(item => {
            const dir = item.info.workspace || 'other';
            if (!groups[dir]) groups[dir] = [];
            groups[dir].push(item);
        });
        const sortedDirs = Object.keys(groups).sort((a, b) => a.localeCompare(b));
        return sortedDirs.map(dir => ({
            dir,
            items: groups[dir].sort((a, b) => a.info.name.localeCompare(b.info.name))
        }));
    }, [currentWorkspace]);

    return (
        <>
            {props.isVisible && <WorkspaceTabToggle whichShow={whichShow} setWhichShow={setWhichShow} />}

            <div className={`relative flex flex-col w-full h-[calc(100vh-54px)] ${props.isVisible ? '' : 'hidden'}`}>
                <div className="flex flex-col h-full min-h-0">

                    <div className={`flex-1 min-h-0 flex overflow-hidden p-2 transition-all duration-500 ${isTerminalMaximized ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className={`pr-4 flex-1 xl:grid-cols-4 pt-9 h-full overflow-y-auto grid grid-cols-1 md:grid-cols-2 content-start gap-4 relative transition-all duration-300`}>
                            {groupedWorkspaces.map((group) => (
                                <div key={group.dir} className="contents">
                                    {whichShow === "all" && (
                                        <div className="col-span-full">
                                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">
                                                {group.dir}
                                            </h2>
                                        </div>
                                    )}
                                    {group.items.map((item) => (
                                        <div key={item.info.name}>
                                            <WorkspaceCard {...item} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div> 
                    </div>

                    <div
                        className={`transition-all duration-500 ease-in-out
                            ${isTabTerminalVisible
                                ? `${isTerminalMaximized ? 'h-[calc(100vh-100px)]' : 'h-[40%]'} opacity-100 translate-y-0`
                                : 'h-0 opacity-0 translate-y-4 overflow-hidden pointer-events-none'
                            }`}
                    >
                        <TabTerminal
                            whichShow={whichShow}
                            isMaximized={isTerminalMaximized}
                            onToggleMaximize={() => setIsTerminalMaximized(!isTerminalMaximized)}
                        />
                    </div>
                </div>

                <FloatingBtn />
                <WorkspaceOptionModal />
                <WorkspaceNew />
                <ModalTerminal />
                <Loading />
            </div>
        </>
    )
}

