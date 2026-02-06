import apiRoute from 'apiroute';
import config from 'config';

const stopInteractiveTerminal = async (set: any, get: any, workspaceName: string, skips?: boolean) => {
    if (config.useDemo) return;

    const isLoading = get().loadingWorkspace;
    if (isLoading == workspaceName) return;
    set({ loadingWorkspace: workspaceName });

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.stopInteractiveTerminal}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ workspace: { name: workspaceName } })
        });
        if (!response.ok) {
            throw new Error('Failed to stop interactive terminal');
        }

        if (!skips)
            await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
        console.error('Error stopping interactive terminal:', error);
    }

    set({ loadingWorkspace: null });
};

export default stopInteractiveTerminal;
