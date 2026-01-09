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
    workspace: WorkspaceItem[];
    activeTerminal: string;
    loadWorkspace: () => Promise<void>;
    setActiveTerminal: (terminal: string) => void;

    /**
     * Write on console of a workspace
     * @param workspaceName 
     * @param output 
     */
    writeOnConsole: (workspaceName: string, output: string) => void;
    clearConsole: (workspaceName: string) => void;
    setWorkSpaceRunningAs: (workspaceName: string, runas: 'dev' | 'start' | null) => void;
}

const workspaceState = create<workspaceContext>()((set, get) => ({
    workspace: [],
    activeTerminal: '',

    setActiveTerminal: (terminal: string) => {
        set({ activeTerminal: terminal });
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
        const trimed    = output.trim();
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

        //if already exist in workspace dont add to make sure data is not cleared
            const currentWorkspace = get().workspace;
            const newWorkspace: WorkspaceItem[] = []
            workspaceResponse.workspace.forEach((item) => {
                if (!currentWorkspace.find((i) => i.info.name === item.name)) {
                    newWorkspace.push({
                        isRunningAs: null,
                        consoleOutput: null,
                        info: item
                    })
                }
            })

        //Perform filter
            const runningStartWorkspace = newWorkspace.filter((item) => item.isRunningAs === 'start');
            const runningDevWorkspace   = newWorkspace.filter((item) => item.isRunningAs === 'dev');
            const runningStartWorkSpaceAlphabetical = runningStartWorkspace.sort((a, b) => {
                if (a.info.name < b.info.name) return -1;
                if (a.info.name > b.info.name) return 1;
                return 0;
            });
            const runningDevWorkSpaceAlphabetical = runningDevWorkspace.sort((a, b) => {
                if (a.info.name < b.info.name) return -1;
                if (a.info.name > b.info.name) return 1;
                return 0;
            });

            const stoppedWorkspace = newWorkspace.filter((item) => !item.isRunningAs);
            stoppedWorkspace.sort((a, b) => {
                if (a.info.name < b.info.name) return -1;
                if (a.info.name > b.info.name) return 1;
                return 0;
            });

            set({
                workspace: [
                    ...runningStartWorkSpaceAlphabetical,
                    ...runningDevWorkSpaceAlphabetical,
                    ...stoppedWorkspace
                ]
            });



        } catch (error) {
            console.error('Error fetching workspace:', error);
            set({
                workspace: defaultWorkspace
            });
        }








    }
}));

const useWorkspaceState = createSelectors(workspaceState);
export default useWorkspaceState;
