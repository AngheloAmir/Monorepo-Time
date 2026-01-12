import { useState } from "react";
import useAppState from "../../_context/app";
import useWorkspaceState from "../../_context/workspace";
import config   from "config";
import apiRoute from "apiroute";
import ButtonFloating from "../ui/ButtonFloating";

export default function FloatingBtn() {
    const workspace           = useWorkspaceState.use.workspace();
    const setShowWorkspaceNew = useWorkspaceState.use.setShowWorkspaceNew();
    const setShowTerminal = useAppState.use.setShowTerminal();
    const [filesShow, setFilesShow] = useState(true);
    async function showHideFiles() {
        try {
            //count the number of running workspace
            let pathInclude: string[] = [];
            const runningWorkspace = workspace.filter((item) => item.isRunningAs != null);
            const runningCount = runningWorkspace.length;

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
                    hide: filesShow,
                    pathInclude: pathInclude
                }),
            });
            const data = await response.json();
            if (data.isHidden) {
                setFilesShow(false);
            } else {
                setFilesShow(true);
            }

        } catch (error) {
            console.error('Error toggling files visibility:', error);
        }
    }

    return (
        <>
            <ButtonFloating
                onClick={() => setShowTerminal(true)}
                bottom="44"
                right="8"
                icon="fa-solid fa-terminal"
                text="Root Terminal"
                
            />

            <ButtonFloating
                onClick={() => showHideFiles()}
                bottom="26"
                right="8"
                icon={filesShow ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}
                text={filesShow ? 'Hide Files' : 'Show Files'}
               
            />

            <ButtonFloating
                onClick={() => setShowWorkspaceNew(true)}
                bottom="8"
                right="8"
                icon="fa-solid fa-plus"
                text="Add Workspace"
               
            />
        </>
    )
}