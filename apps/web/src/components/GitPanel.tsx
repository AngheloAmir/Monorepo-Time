import { useEffect } from "react";
import useGitControlContext from "../appstates/gitcontrol";
import GitHistory from "./GitControl/GitHistory";
import GitInput from "./GitControl/GitInput";
//import GitBranches from "./GitControl/GitBranches";
import RevertModal from "./GitControl/RevertModal";
import useAppState from "../appstates/app";
import ModalBody from "./ui/ModalBody";
import ModalHeader from "./ui/ModalHeader";

import GitStash from "./GitControl/GitStash";

export default function GitPanel() {
    const fetchData = useGitControlContext.use.fetchData();
    const selectedCommit = useGitControlContext.use.selectedCommit();
    const showGit = useAppState.use.showGit();
    const setShowGit = useAppState.use.setShowGit();
    const commitLoading = useGitControlContext.use.commitLoading();

    useEffect(() => {
        if (showGit) fetchData();
    }, [showGit]);


    if (!showGit) return null;
    return (
        <ModalBody width="900px">
            <ModalHeader
                title="Git Panel"
                description="Manage your repository, branches, and commits."
                close={() => setShowGit(false)}
            />
            <div className="flex h-[500px]" aria-disabled={commitLoading}>
                {/* <div className="w-[250px] flex-shrink-0">
                    <GitBranches />
                </div> */}

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="h-12 p-3 border-b border-white/10 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-300">
                            Your Commit History
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0 relative">
                        <GitHistory />
                    </div>
                    <div className="p-2">
                        <GitInput />
                    </div>
                </div>

                <div className="w-[300px] flex-shrink-0">
                    <GitStash />
                </div>
            </div>

            {selectedCommit && <RevertModal />}
        </ModalBody>
    );
}