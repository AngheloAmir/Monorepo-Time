import { useEffect } from "react";
import useGitControlContext from "../../appstates/gitcontrol";
import GitHistory from "./GitHistory";
import GitInput from "./GitInput";
import RevertModal from "./RevertModal";
import useAppState from "../../appstates/app";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";

export default function GitControl() {
    const fetchData      = useGitControlContext.use.fetchData();
    const selectedCommit = useGitControlContext.use.selectedCommit();
    //const showGit        = useAppState.use.showGit();
    const setShowGit     = useAppState.use.setShowGit();

    useEffect(() => {
        fetchData();
    }, []);

    //if(!showGit) return null;

    return (
        <ModalBody width="800px">
            <ModalHeader
                title="Git Control"
                description="Git Control"
                close={() => setShowGit(false)}
            />
            <div className="p-3 overflow-y-auto text-md h-[450px]">       
                 <GitHistory />
            </div>
            <GitInput />

            { selectedCommit && <RevertModal /> }
       </ModalBody>
    );
}