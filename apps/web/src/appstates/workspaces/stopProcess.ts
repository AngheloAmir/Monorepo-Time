import apiRoute from 'apiroute';
import config from 'config';

const stopProcess = async (set: any, get: any, workspaceName: string) => {
    if (config.useDemo) return;

    const isLoading = get().loadingWorkspace;
    if (isLoading == workspaceName) return;
    set({ loadingWorkspace: workspaceName });

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.stopProcess}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ workspace: { name: workspaceName } })
        });
        if (!response.ok) {
            throw new Error('Failed to stop process');
        }
    } catch (error) {
        console.error('Error stopping process:', error);
    }

    set({ loadingWorkspace: null });
}
export default stopProcess;