import apiRoute from "apiroute";
import config from "config";
import type { WorkspaceInfo } from "types";

const updateWorkspace = async (workspace: WorkspaceInfo) => {
    if (config.useDemo) return true;

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.updateWorkspace}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workspace),
        });
        await response.json();
        return true;
    } catch (error) {
        return false;
    }
}

export default updateWorkspace;