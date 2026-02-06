import config from 'config';
import type { WorkspaceInfo } from 'types';

const setWorkspaceTemplate = async (set: any, workspace: WorkspaceInfo, template: string) => {
    if (config.useDemo) return;
    window.isLoadingCancelled = false;

    // Import socket.io-client dynamically to avoid SSR issues
    const { io } = await import('socket.io-client');

    return new Promise<void>((resolve, reject) => {
        const socket = io(config.serverPath, {
            transports: ['websocket'],
            forceNew: true,
            reconnection: false
        });

        // Set initial loading message  
        set({ loadMessage: `Connecting...` });

        socket.on('connect', () => {
            set({ loadMessage: `Starting template '${template}'...` });
            socket.emit('template:start', { workspace, templatename: template });

            if (window.isLoadingCancelled) {
                socket.disconnect();
                reject(new Error('Loading cancelled'));
            }
        });

        socket.on('template:progress', (data: { message: string }) => {
            set({ loadMessage: data.message });
            console.log('[Template Progress]', data.message);

            if (window.isLoadingCancelled) {
                socket.disconnect();
                reject(new Error('Loading cancelled'));
            }
        });

        socket.on('template:success', (data: { message: string }) => {
            set({ loadMessage: data.message });
            console.log('[Template Success]', data.message);
            socket.disconnect();
            resolve();
        });

        socket.on('template:error', (data: { error: string }) => {
            set({ loadMessage: `Error: ${data.error}` });
            console.error('[Template Error]', data.error);

            alert(data.error);
            socket.disconnect();
            reject(new Error(data.error));
        });

        socket.on('connect_error', (err) => {
            set({ loadMessage: `Connection error: ${err.message}` });
            console.error('[Template Connect Error]', err);

            alert(err.message);
            socket.disconnect();
            reject(err);
        });

        // Timeout after 5 minutes
        setTimeout(() => {
            if (socket.connected) {
                socket.disconnect();
                set({ loadMessage: 'Template setup timed out' });
                reject(new Error('Template setup timed out'));
            }
        }, 5 * 60 * 1000);
    });
};

export default setWorkspaceTemplate;