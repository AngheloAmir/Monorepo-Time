import apiRoute from "apiroute";
import config from "config";

const listWorkspace = async () => {
    if (config.useDemo) return [];

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.listWorkspacesDir}`);
        if (!response.ok) {
            throw new Error('Failed to list workspace');
        }
        return await response.json();
    } catch (error) {
        console.error('Error listing workspace:', error);
        return [];
    }
}

export default listWorkspace;