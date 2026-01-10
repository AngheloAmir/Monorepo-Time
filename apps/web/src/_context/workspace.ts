import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { WorkspaceInfo } from 'types';
import apiRoute from 'apiroute';
import config from 'config';
import defaultWorkspace from './fake/defaultWorkspace';

export interface WorkspaceItem {
    isRunningAs: 'dev' | 'start' | null;
    consoleOutput: string | null;
    info: WorkspaceInfo;
}

interface workspaceContext {
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

    /**
     * Write on console of a workspace
     * @param workspaceName 
     * @param output 
     */
    writeOnConsole: (workspaceName: string, output: string) => void;

    /** clear console of a workspace */
    clearConsole: (workspaceName: string) => void;

    /** set workspace running as */
    setWorkSpaceRunningAs: (workspaceName: string, runas: 'dev' | 'start' | null) => void;

    /** loading */
    loading: boolean;

    /** show workspace new modal */
    setShowWorkspaceNew: (show: boolean) => void;

    /** It has content of workspace to show new terminal window */
    showNewTerminalWindow: WorkspaceInfo | null;

    /** Close or show a terminal window */
    setShowNewTerminalWindow: (workspace: WorkspaceInfo | null) => void;

    ///API calls
    //function that calls API
    stopProcess: (workspaceName: string) => Promise<void>;
    listWorkspace: () => Promise<any>;
    createNewWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;

}

const workspaceState = create<workspaceContext>()((set, get) => ({
    workspace: [],
    activeTerminal: '',
    activeWorkspaceOptionModal: null,
    loadingWorkspace: null,
    loading: false,
    showWorkspaceNew: false,
    showNewTerminalWindow: null,

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

    writeOnConsole: (workspaceName: string, output: string) => {
        const workspace = get().workspace.find((item) => item.info.name === workspaceName);
        const trimed = output.trim();
        if (workspace && trimed) {
            set({
                workspace: get().workspace.map((item) => {
                    if (item.info.name === workspaceName) {
                        return {
                            ...item,
                            consoleOutput:
                                item.consoleOutput ?
                                    `${item.consoleOutput}\n${trimed}` :
                                    trimed
                        }
                    }
                    return item;
                })
            });
        }
    },

    clearConsole: (workspaceName: string) => {
        const workspace = get().workspace.find((item) => item.info.name === workspaceName);
        if (workspace) {
            set({
                workspace: get().workspace.map((item) => {
                    if (item.info.name === workspaceName) {
                        return {
                            ...item,
                            consoleOutput: null
                        }
                    }
                    return item;
                })
            });
        }
    },

    loadWorkspace: async () => {
        const isLoading = get().loading;
        if (isLoading) return;
        set({ loading: true });

        try {
            const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.scanWorkspace}`);
            let workspaceResponse: {
                root: string;
                count: number;
                workspace: WorkspaceInfo[];
            } = await response.json() as any
            if (!response.ok || workspaceResponse.workspace.length === 0) {
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
                        consoleOutput: currentWorkspace.find((i) => i.info.name === item.name)?.consoleOutput ?? null,
                        info: item
                    })
                } else {
                    newWorkspace.push({
                        isRunningAs: null,
                        consoleOutput: null,
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
            set({
                workspace: defaultWorkspace
            });
        }

        set({ loading: false });
    },

    //==========================================================================
    // API calls
    //==========================================================================
    stopProcess: async (workspaceName: string) => {
        const isLoading = get().loadingWorkspace;
        if (isLoading == workspaceName) return;
        set({ loadingWorkspace: workspaceName });

        try {
            const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.stopProcess}`, {
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

    listWorkspace: async () => {
        try {
            const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.listWorkspacesDir}`);
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
        try {
            const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.newWorkspace}`, {
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

}));

const useWorkspaceState = createSelectors(workspaceState);
export default useWorkspaceState;
