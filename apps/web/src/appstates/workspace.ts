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

/**
 * @interface WorkspaceItem
 * @description Interface for a workspace item
 * @property {string | null} isRunningAs - The running status of the workspace
 * @property {WorkspaceInfo} info - The base information of the workspace
 */
export interface WorkspaceItem {
    isRunningAs: 'dev' | 'start' | 'crashed' | null;
    info: WorkspaceInfo;
}

/**
 * @interface workspaceContext
 * @description Interface for the workspace context
 * @property {boolean} workspaceLoading - Whether the workspace is loading
 * @property {WorkspaceItem[]} workspace - The list of workspaces
 * @property {string} activeTerminal - The active terminal
 * @property {WorkspaceInfo | null} activeWorkspaceOptionModal - The active workspace option modal
 * @property {string | null} loadingWorkspace - The name of the workspace that is still loading
 * @property {boolean} loading - Whether the workspace is loading
 * @property {boolean} showWorkspaceNew - Whether the workspace new modal is shown
 * @property {WorkspaceInfo | null} showNewTerminalWindow - The workspace that is shown in the new terminal window
 * @property {string} loadMessage - The message to be displayed when the workspace is loading
 * @property {() => Promise<void>} loadWorkspace - Function to load the workspace
 * @property {(terminal: string) => void} setActiveTerminal - Function to set the active terminal
 * @property {(workspace: WorkspaceInfo | null) => void} setActiveWorkspaceOptionModal - Function to set the active workspace option modal
 * @property {(workspaceName: string, runas: 'dev' | 'start' | 'crashed' | null) => void} setWorkSpaceRunningAs - Function to set the workspace running as
 * @property {(show: boolean) => void} setShowWorkspaceNew - Function to set the workspace new modal
 * @property {(workspace: WorkspaceInfo | null) => void} setShowNewTerminalWindow - Function to set the new terminal window
 * @property {(loading: boolean) => void} setWorkspaceLoading - Function to set the workspace loading
 * @property {(workspaceName: string) => Promise<void>} stopProcess - Function to stop the process
 * @property {(workspaceName: string, skips?: boolean) => Promise<void>} stopInteractiveTerminal - Function to stop the interactive terminal
 * @property {(workspaceName: string, skips?: boolean) => Promise<void>} stopWorkspaceTerminal - Function to stop the workspace terminal
 * @property {(workspaceName: WorkspaceInfo) => Promise<boolean>} createNewWorkspace - Function to create a new workspace
 * @property {(workspace: WorkspaceInfo) => Promise<boolean>} updateWorkspace - Function to update the workspace
 * @property {(workspace: WorkspaceInfo, template: string) => Promise<void>} setWorkspaceTemplate - Function to set the workspace template
 * @property {(currentWorkspace: WorkspaceInfo) => Promise<string>} deleteWorkspace - Function to delete the workspace
 */
interface workspaceContext {
    workspaceLoading: boolean;
    workspace:      WorkspaceItem[];
    workspaceDirs:  string[];
    activeTerminal: string;
    activeWorkspaceOptionModal: WorkspaceInfo | null;
    loadingWorkspace: string | null;
    showWorkspaceNew: boolean;

    loadWorkspace: () => Promise<void>;
    setActiveTerminal: (terminal: string) => void;
    setActiveWorkspaceOptionModal: (workspace: WorkspaceInfo | null) => void;
    setWorkSpaceRunningAs: (workspaceName: string, runas: 'dev' | 'start' | 'crashed' | null) => void;

    loading: boolean;
    setShowWorkspaceNew: (show: boolean) => void;
    showNewTerminalWindow: WorkspaceInfo | null;
    setShowNewTerminalWindow: (workspace: WorkspaceInfo | null) => void;
    setWorkspaceLoading: (loading: boolean) => void;

    ///API calls
    //function that calls API
    stopProcess: (workspaceName: string) => Promise<void>;
    stopInteractiveTerminal: (workspaceName: string, skips?: boolean) => Promise<void>;
    stopWorkspaceTerminal:   (workspaceName: string, skips?: boolean) => Promise<void>;
    listWorkspace: () => Promise<any>;
    createNewWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;
    updateWorkspace: (workspaceName: WorkspaceInfo) => Promise<boolean>;
    deleteWorkspace: (workspaceName: WorkspaceInfo) => Promise<string>;

    loadMessage: string;
    setWorkspaceTemplate: (workspaceName: WorkspaceInfo, template: string) => Promise<void>;
}

const workspaceState = create<workspaceContext>()((set, get) => ({
    workspace: [],
    workspaceLoading: false,
    workspaceDirs: ['apps', 'packages'], //this is usually the workspace dirs
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
