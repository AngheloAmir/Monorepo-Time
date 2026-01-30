import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { WorkspaceInfo } from 'types';
import apiRoute from 'apiroute';
import config from 'config';
import defaultWorkspace from './demo/defaultWorkspace';

declare global {
    interface Window {
        isLoadingCancelled: boolean | undefined;
    }
}

export interface WorkspaceTemplate {
    name: string;
    description: string;
    template: {

    }
}

export interface WorkspaceItem {
    isRunningAs: 'dev' | 'start' | 'crashed' | null;
    info: WorkspaceInfo;
}

interface workspaceContext {
    /** loading workspace which the workspace itself */
    workspaceLoading: boolean;

    /** Base information of workspace */
    workspace: WorkspaceItem[];

    /** show the workspace console */
    activeTerminal: string;

    /** show the workspace option modal */
    activeWorkspaceOptionModal: WorkspaceInfo | null;

    /** name of the workspace that is still loading */
    loadingWorkspace: string | null;

    /** show workspace new modal */
    showWorkspaceNew: boolean;

    /** load/refresh the content of workspaces */
    loadWorkspace: () => Promise<void>;

    /** set active terminal */
    setActiveTerminal: (terminal: string) => void;

    /** set active workspace option modal */
    setActiveWorkspaceOptionModal: (workspace: WorkspaceInfo | null) => void;

    /** set workspace running as */
    setWorkSpaceRunningAs: (workspaceName: string, runas: 'dev' | 'start' | 'crashed' | null) => void;

    /** loading */
    loading: boolean;

    /** show workspace new modal */
    setShowWorkspaceNew: (show: boolean) => void;

    /** It has content of workspace to show new terminal window */
    showNewTerminalWindow: WorkspaceInfo | null;

    /** Close or show a terminal window for the particular workspace */
    setShowNewTerminalWindow: (workspace: WorkspaceInfo | null) => void;

    /** set workspace loading */
    setWorkspaceLoading: (loading: boolean) => void;

    ///API calls
    //function that calls API
    stopProcess: (workspaceName: string) => Promise<void>;
    stopInteractiveTerminal: (workspaceName: string, skips?: boolean) => Promise<void>;
    stopWorkspaceTerminal:   (workspaceName: string, skips?: boolean) => Promise<void>;
    listWorkspace: () => Promise<any>;
    createNewWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;
    updateWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;

    loadMessage: string;
    setWorkspaceTemplate: (workspaceName: WorkspaceInfo, template: string) => Promise<void>;
}

const workspaceState = create<workspaceContext>()((set, get) => ({
    workspace: [],
    workspaceLoading: false,
    activeTerminal: '',
    activeWorkspaceOptionModal: null,
    loadingWorkspace: null,
    loading: false,
    showWorkspaceNew: false,
    showNewTerminalWindow: null,
    loadMessage: '',

    setWorkspaceLoading: (loading: boolean) => {
        set({ workspaceLoading: loading });
    },

    setShowNewTerminalWindow: (workspace: WorkspaceInfo | null) => {
        set({ showNewTerminalWindow: workspace });
    },

    setActiveWorkspaceOptionModal: (workspace: WorkspaceInfo | null) => {
        set({ activeWorkspaceOptionModal: workspace });
    },

    setActiveTerminal: (terminal: string) => {
        set({ activeTerminal: terminal });
    },

    setShowWorkspaceNew: (show: boolean) => {
        set({ showWorkspaceNew: show });
    },

    setWorkSpaceRunningAs: (workspaceName, runas) => {
        const workspace = get().workspace.find((item) => item.info.name === workspaceName);
        if (workspace) {
            set({
                workspace: get().workspace.map((item) => {
                    if (item.info.name === workspaceName) {
                        return {
                            ...item,
                            isRunningAs: runas
                        }
                    }
                    return item;
                })
            });
        }
    },

    loadWorkspace: async () => {
        if (config.useDemo) {
            set({ workspace: defaultWorkspace });
            return;
        }

        const isLoading = get().loading;
        if (isLoading) return;
        set({ loading: true });

        try {
            const response = await fetch(`${config.serverPath}${apiRoute.scanWorkspace}`);
            let workspaceResponse: {
                root: string;
                count: number;
                workspace: WorkspaceInfo[];
            } = await response.json() as any
            if (!response.ok) {
                throw new Error('Failed to fetch workspace');
            }

            const newWorkspace: WorkspaceItem[] = [];
            const currentWorkspace = get().workspace;
            workspaceResponse.workspace.forEach((item: WorkspaceInfo) => {
                //if already exist in workspace dont add to make sure data is not cleared
                //but refresh only the information
                if (currentWorkspace.find((i) => i.info.name === item.name)) {
                    newWorkspace.push({
                        isRunningAs: currentWorkspace.find((i) => i.info.name === item.name)?.isRunningAs ?? null,
                        info: item
                    })
                } else {
                    newWorkspace.push({
                        isRunningAs: null,
                        info: item
                    })
                }
            })

            //sort workspace alphabetically
            const alphabeticalWorkspace = newWorkspace.sort((a, b) => {
                if (a.info.name < b.info.name) return -1;
                if (a.info.name > b.info.name) return 1;
                return 0;
            });

            set({ workspace: alphabeticalWorkspace });
        } catch (error) {
            console.error('Error fetching workspace:', error);
        }
        set({ loading: false });
    },

    //==========================================================================
    // API calls
    //==========================================================================
    stopProcess: async (workspaceName: string) => {
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
    },

    stopInteractiveTerminal: async (workspaceName: string, skips?: boolean) => {
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
    },

    stopWorkspaceTerminal: async (workspaceName: string, skips?: boolean) => {
        if (config.useDemo) return;
        const isLoading = get().loadingWorkspace;
        if (isLoading == workspaceName) return;
        set({ loadingWorkspace: workspaceName });

        const workspace = get().workspace.find((item) => item.info.name === workspaceName);
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
    },


    listWorkspace: async () => {
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
    },

    createNewWorkspace: async (workspaceName: WorkspaceInfo) => {
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
    },

    updateWorkspace: async (workspace: WorkspaceInfo) => {
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
    },

    setWorkspaceTemplate: async (workspace: WorkspaceInfo, template: string) => {
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

                if(window.isLoadingCancelled) {
                    socket.disconnect();
                    reject(new Error('Loading cancelled'));
                }
            });

            socket.on('template:progress', (data: { message: string }) => {
                set({ loadMessage: data.message });
                console.log('[Template Progress]', data.message);

                if(window.isLoadingCancelled) {
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
                socket.disconnect();
                reject(new Error(data.error));
            });

            socket.on('connect_error', (err) => {
                set({ loadMessage: `Connection error: ${err.message}` });
                console.error('[Template Connect Error]', err);
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
    },

}));


const useWorkspaceState = createSelectors(workspaceState);
export default useWorkspaceState;
