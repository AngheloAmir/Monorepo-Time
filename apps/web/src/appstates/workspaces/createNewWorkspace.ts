import apiRoute from "apiroute";
import config from "config";
import type { WorkspaceInfo } from "types";

const createNewWorkspace = async (workspaceName: WorkspaceInfo) => {
    if (config.useDemo) return true;

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.newWorkspace}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workspaceName),
        });
        await response.json();
        return true;    
    } catch (error) {
        return false;
    }
}

export default createNewWorkspace;