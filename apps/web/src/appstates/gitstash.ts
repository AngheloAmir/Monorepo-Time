import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';

interface gitStashContext {
    showStash: boolean;
    setShowStash: ( isShow :boolean) => void;
    stashList:  string[];
    stashCount: number;

    loadGitStashList: () => Promise<void>;
    addGitStash:      (stashName: string) => Promise<void>;
    revertGitStash:   (stashName: string) => Promise<void>;
    clearGitStash:    () => Promise<void>;
}

const gitStashContext = create<gitStashContext>()((set) => ({
    showStash: false,
    stashList: [],
    stashCount: 0,

    setShowStash: (isShow: boolean) => set({ showStash: isShow }),

    loadGitStashList: async () => {
        const res  = await fetch(`${config.serverPath}${apiRoute.gitStash}/list`);
        const data = await res.json();
        if(data.length > 0) {
            set({ stashCount: data.length });
        }
        set({ stashList: data });
    },

    addGitStash: async (stashName: string) => {
        const res  = await fetch(`${config.serverPath}${apiRoute.gitStash}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stashName }),
        });
        const data = await res.json();
        set({ stashList: data });
    },

    revertGitStash: async (stashName: string) => {
        const res  = await fetch(`${config.serverPath}${apiRoute.gitStash}/revert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stashName }),
        });
        const data = await res.json();
        set({ stashList: data });
    },

    clearGitStash: async () => {
        await fetch(`${config.serverPath}${apiRoute.gitStash}/clear`);
        set({ stashList: [] });
    },
}));

const useGitStash = createSelectors(gitStashContext);
export default useGitStash;
