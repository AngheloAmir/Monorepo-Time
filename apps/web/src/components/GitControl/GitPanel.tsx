import { useEffect } from "react";
import useGitControlContext from "../../appstates/gitcontrol";
import GitHistory from "./GitHistory";
import GitInput from "./GitInput";
import GitBranches from "./GitBranches";
import RevertModal from "./RevertModal";
import useAppState from "../../appstates/app";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";

export default function GitPanel() {
    const fetchData      = useGitControlContext.use.fetchData();
    const selectedCommit = useGitControlContext.use.selectedCommit();
    const showGit        = useAppState.use.showGit();
    const setShowGit     = useAppState.use.setShowGit();
    const commitLoading  = useGitControlContext.use.commitLoading();

    useEffect(() => {
        if(showGit) fetchData();
    }, [showGit]);
    

    if(!showGit) return null;
    return (
        <ModalBody width="1100px">
            <ModalHeader
                title="Git Panel"
                description="Manage your repository, branches, and commits."
                close={() => setShowGit(false)}
            />
            
            <div className="flex bg-[#0c0c0c] h-[500px] divide-x divide-white/10"
                aria-disabled={commitLoading}
            >
                <div className="w-[280px] flex-shrink-0 bg-black/20">
                    <GitBranches />
                </div>

                <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0c]">
                    <div className="flex-1 overflow-y-auto p-0 relative">
                        <GitHistory />
                    </div>
                    <div className="border-t border-white/10 p-3 bg-black/20">
                        <GitInput />
                    </div>
                </div>
            </div>

            { selectedCommit && <RevertModal /> }
       </ModalBody>
    );
}