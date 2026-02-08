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
}

export type ProjectTree = File | Folder;

interface projectContext {
    projectTree: ProjectTree[];
    loadProjectTree: () => Promise<void>;
}

const projectState = create<projectContext>()((set) => ({
    projectTree: [],
    loadProjectTree: async () => {
        if(config.useDemo) return;
        const response = await fetch(`${config.serverPath}${apiRoute.scanProject}`);
        const data = await response.json();

        console.log(data.root);

        set({ projectTree: data.root });
    },
}));

const useProjectState = createSelectors(projectState);
export default useProjectState;
