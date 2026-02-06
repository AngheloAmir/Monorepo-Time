import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { WorkspaceInfo } from 'types';
import loadWorkspace from './workspaces/loadWorkspace';
import stopProcess from './workspaces/stopProcess';
import stopInteractiveTerminal from './workspaces/stopInteractiveTerminal';
import stopWorkspaceTerminal from './workspaces/stopWorkspaceTerminal';
import listWorkspace from './workspaces/listWorkspace';
import createNewWorkspace from './workspaces/createNewWorkspace';
import updateWorkspace from './workspaces/updateWorkspace';
import setWorkspaceTemplate from './workspaces/setWorkspaceTemplate';
import deleteWorkspace from './workspaces/deleteWorkspace';

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

    /** list workspace folders*/
    listWorkspace: () => Promise<any>;

    /** create new workspace */
    createNewWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;

    /** update workspace */
    updateWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;

    /** delete workspace */
    deleteWorkspace: (workspaceName: WorkspaceInfo) => Promise<string>;

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

    listWorkspace: async () => 
        listWorkspace(),

    loadWorkspace: () => 
        loadWorkspace(set, get),

    stopProcess: (workspaceName: string) => 
        stopProcess(set, get, workspaceName),

    stopInteractiveTerminal: async (workspaceName: string, skips?: boolean) => 
        stopInteractiveTerminal(set, get, workspaceName, skips),

    stopWorkspaceTerminal: async (workspaceName: string, skips?: boolean) => 
        stopWorkspaceTerminal(set, get, workspaceName, skips),

    createNewWorkspace: async (workspaceName: WorkspaceInfo) => {
        return await createNewWorkspace(workspaceName);
    },

    updateWorkspace: async (workspace: WorkspaceInfo) => {
        return await updateWorkspace(workspace);
    },

    setWorkspaceTemplate: async (workspace: WorkspaceInfo, template: string) => {
        return await setWorkspaceTemplate(set, workspace, template);
    },

    deleteWorkspace: async (currentWorkspace: WorkspaceInfo) => {
        return await deleteWorkspace(set, get, currentWorkspace);
    },
}));

const useWorkspaceState = createSelectors(workspaceState);
export default useWorkspaceState;
