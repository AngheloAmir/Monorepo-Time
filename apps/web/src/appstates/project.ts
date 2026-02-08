import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';

export interface File {
    file: string;
    path: string;
    color: string;
}

export interface Folder {
    folder: string;
    content: ProjectTree[];
    color: string;
    path: string;
}

export type ProjectTree = File | Folder;

interface projectContext {
    projectTree: ProjectTree[];
    root: string;
    changes: number;
    openFolders: Record<string, boolean>;
    loadProjectTree: () => Promise<void>;
    toggleFolder: (path: string) => void;
}

const projectState = create<projectContext>()((set) => ({
    projectTree: [],
    root: "",
    changes: 0,
    openFolders: {},
    loadProjectTree: async () => {
        if(config.useDemo) return;
        const response = await fetch(`${config.serverPath}${apiRoute.scanProject}`);
        const data = await response.json();
        set({ 
            projectTree: data.content,
            root: data.root,
            changes: data.changes 
        });
    },
    toggleFolder: (path: string) => set((state) => ({
        openFolders: {
            ...state.openFolders,
            [path]: !state.openFolders[path]
        }
    })),
}));

const useProjectState = createSelectors(projectState);
export default useProjectState;
