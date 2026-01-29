import { useEffect, useState } from "react";
import useWorkspaceState, { type WorkspaceItem } from "../../appstates/workspace"
import TabTerminal from "../workspace/TabTerminal";
import WorkspaceCard from "../workspace/WorkSpaceCard";
import WorkspaceOptionModal from "../workspace/WorkspaceOptionModal";
import WorkspaceNew from "../workspace/WorkspaceNew";
import ModalTerminal from "../workspace/ModalTerminal";
import FloatingBtn from "../workspace/FloatingBtn";
import GitControl from "../workspace/GitControl";
import Loading from "../workspace/Loading";
import { WorkspaceTabToggle } from "../workspace/WorkspaceTabToggle";

interface WorkspaceProps {
    isVisible: boolean
}

export default function Workspace(props: WorkspaceProps) {
    const [whichShow, setWhichShow] = useState("all");
    const workspace     = useWorkspaceState.use.workspace();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();
    const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceItem[] | null>(null);

    useEffect(() => {
        if (props.isVisible) {
            loadWorkspace();
        }
    }, [props.isVisible]);

    useEffect(() => {
        if (whichShow === "all") {
            setCurrentWorkspace(workspace);
        } else if (whichShow === "apps") {
            setCurrentWorkspace(workspace.filter((item) => item.info.appType == undefined));
        } else {
            setCurrentWorkspace(workspace.filter((item) => item.info.appType === "tool"));
        }
    }, [whichShow, workspace]);

    return (
        <>
            { props.isVisible && <WorkspaceTabToggle whichShow={whichShow} setWhichShow={setWhichShow} /> }
            
            <div className={`relative flex flex-col w-full h-[calc(100vh-54px)] ${props.isVisible ? '' : 'hidden'}`}>
                <div className="grid grid-rows-5 h-full min-h-0 gap-2">
                    <div className="row-span-3 min-h-0 grid grid-cols-4 gap-2 overflow-hidden p-2">
                        <div className="pt-9 col-span-3 h-full overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-2 relative">
                            {currentWorkspace?.map((item) => (
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
                        <TabTerminal whichShow={whichShow}/>
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

