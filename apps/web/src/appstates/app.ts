import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import { path } from './_relative';

interface appContext {
    showTerminal: boolean;
    setShowTerminal: (show: boolean) => void;
    rootDir: string;
    loadRootDir: () => Promise<void>;
    checkIfFirstTime: () => Promise<boolean>;
    showAboutModal: boolean;
    setShowAboutModal: (show: boolean) => void;

    initMonorepoTime: () => Promise<void>;

    notes: string;
    noteNotFound: boolean;
    setNotes: (notes: string) => void;
    loadNotes: () => Promise<void>;
    saveNotes: () => Promise<void>;

    scaffoldRepo: () => Promise<{ success: boolean; error?: string }>;
    hideShowFileFolder: (filesShow: boolean, pathInclude: string[]) => Promise<{ isHidden: boolean }>;
}

const appstate = create<appContext>()((set, get) => ({
    showTerminal: false,
    setShowTerminal: (show: boolean) => set({ showTerminal: show }),
    rootDir: '',
    showAboutModal: false,
    setShowAboutModal: (show: boolean) => set({ showAboutModal: show }),

    loadRootDir: async () => {
        if (get().rootDir.length > 0) return;
        try {
            const response = await fetch(`${path}${apiRoute.getRootPath}`);
            const data = await response.json();
            set({ rootDir: data.path });
        } catch (err) {

        }
    },

    checkIfFirstTime: async () => {
        try {
            const response = await fetch(`${path}${apiRoute.firstRun}`);
            const data = await response.json();
            return data.isFirstTime;
        } catch (error) {
            return false;
        }
    },

    initMonorepoTime: async () => {
        try {
            await fetch(`${path}${apiRoute.initMonorepoTime}`);
        } catch (error) {
            console.error('Error initializing Monorepo Time:', error);
        }
    },

    notes: '',
    noteNotFound: true,
    setNotes: (notes: string) => set({ notes }),
    loadNotes: async () => {
        try {
            const response = await fetch(`${path}${apiRoute.notes}`);

            if (!response.ok) {
                set({ noteNotFound: true });
                return;
            }

            const data = await response.json();
            set({ notes: data.notes, noteNotFound: false });
        } catch (error) {
            set({ noteNotFound: true });
        }
    },
    saveNotes: async () => {
        try {
            await fetch(`${path}${apiRoute.notes}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes: get().notes }),
            });
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    },

    scaffoldRepo: async () => {
        const response = await fetch(`${path}${apiRoute.scaffoldRepo}`);
        const data = await response.json();
        return data;
    },

    hideShowFileFolder: async (filesShow: boolean, pathInclude: string[]) => {
        const response = await fetch(`${path}${apiRoute.hideShowFileFolder}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hide: filesShow,
                pathInclude: pathInclude
            }),
        });
        const data = await response.json();
        return data;
    }
}));

const useAppState = createSelectors(appstate);
export default useAppState;
