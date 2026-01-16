import { useState } from "react";
import useAppState from "../../appstates/app";
import useWorkspaceState from "../../appstates/workspace";
import ButtonFloating from "../ui/ButtonFloating";

export default function FloatingBtn() {
    const hideShowFileFolder  = useAppState.use.hideShowFileFolder();
    const workspace           = useWorkspaceState.use.workspace();
    const setShowWorkspaceNew = useWorkspaceState.use.setShowWorkspaceNew();
    const setShowTerminal = useAppState.use.setShowTerminal();
    const [filesShow, setFilesShow] = useState(true);
    async function showHideFiles() {    
        try {
            let pathInclude: string[] = [];
            const runningWorkspace = workspace.filter((item) => item.isRunningAs != null);
            const runningCount = runningWorkspace.length;
            if (runningCount > 0) {
                pathInclude = workspace.filter((item) => item.isRunningAs == null).map((item) => item.info.path);
            }
            const response = await hideShowFileFolder(filesShow, pathInclude);
            if (response.isHidden)  setFilesShow(false);
            else setFilesShow(true);
        } catch (error) {
            console.error('Error toggling files visibility:', error);
        }
    }

    return (
        <>
            <ButtonFloating
                onClick={() => setShowTerminal(true)}
                bottom={156}
                right={16}
                icon="fa-solid fa-terminal"
                text="Root Terminal"
                
            />

            <ButtonFloating
                onClick={() => showHideFiles()}
                bottom={82}
                right={16}
                icon={filesShow ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}
                text={filesShow ? 'Hide Files' : 'Show Files'}
               
            />

            <ButtonFloating
                onClick={() => setShowWorkspaceNew(true)}
                bottom={8}
                right={16}
                icon="fa-solid fa-plus"
                text="Add Workspace"
               
            />
        </>
    )
}