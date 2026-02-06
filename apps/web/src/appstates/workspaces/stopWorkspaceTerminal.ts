import apiRoute from 'apiroute';
import config from 'config';
import type { WorkspaceItem } from '../workspace';

const stopWorkspaceTerminal = async (set: any, get: any, workspaceName: string, skips?: boolean) => {
    if (config.useDemo) return;
    const isLoading = get().loadingWorkspace;
    if (isLoading == workspaceName) return;
    set({ loadingWorkspace: workspaceName });

    const workspace = get().workspace.find((item: WorkspaceItem) => item.info.name === workspaceName);
    const workspacePath = workspace?.info.path;

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.stopTerminalWorkspace}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workspace: {
                    name: workspaceName,
                    path: workspacePath
                }
            })
        });
        if (!response.ok) {
            let errMsg = 'Failed to stop interactive terminal';
            try {
                const errText = await response.text();
                try {
                    const errBody = JSON.parse(errText);
                    errMsg = errBody.message || errBody.error || errMsg;
                } catch {
                    if (errText) errMsg = errText;
                }
            } catch (e) {
                // Body might be empty or unreadable
            }
            console.error('[Frontend] Backend error:', errMsg);
            throw new Error(errMsg);
        }

        if (!skips)
            await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
        console.error('Error stopping interactive terminal:', error);
    }
    set({ loadingWorkspace: null });
}

export default stopWorkspaceTerminal;