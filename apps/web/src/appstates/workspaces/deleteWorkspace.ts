import apiRoute from "apiroute";
import config from "config";
import type { WorkspaceInfo } from "types";

const deleteWorkspace = async (set: any, get: any, currentWorkspace: WorkspaceInfo) => {
    const isLoading = get().loading;
    if (isLoading) return;
    set({ loading: true });

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.deleteWorkspace}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workspace: currentWorkspace }),
        });
        if (!response.ok) {
            throw new Error('Failed to delete workspace');
        }
        const data = await response.json();
        set({ loading: false });
        return data.message;
    } catch (error) {
        console.error('Error deleting workspace:', error);
        set({ loading: false });
        return 'Error deleting workspace';
    }
};

export default deleteWorkspace;