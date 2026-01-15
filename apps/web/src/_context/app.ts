import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';

interface appContext {
    showTerminal: boolean;
    setShowTerminal: (show: boolean) => void;
    rootDir: string;
    loadRootDir: () => Promise<void>;
    checkIfFirstTime: () => Promise<boolean>;
    showAboutModal: boolean;
    setShowAboutModal: (show: boolean) => void;

    initMonorepoTime: () => Promise<void>;

    notes:        string;
    noteNotFound: boolean;
    setNotes: (notes: string) => void;
    loadNotes: () => Promise<void>;
    saveNotes: () => Promise<void>;
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
            const port = config.apiPort || 3000;
            const response = await fetch(`http://localhost:${port}/${apiRoute.getRootPath}`);
            const data = await response.json();
            set({ rootDir: data.path });
        } catch(err) {
            
        }
    },

    checkIfFirstTime: async () => {
        try {
            const port = config.apiPort || 3000;
            const response = await fetch(`http://localhost:${port}/${apiRoute.firstRun}`);
            const data = await response.json();
            return data.isFirstTime;
        } catch (error) {
            return false;
        }
    },

    initMonorepoTime: async () => {
        try {
            const port = config.apiPort || 3000;
            await fetch(`http://localhost:${port}/${apiRoute.initMonorepoTime}`);
        } catch (error) {
            console.error('Error initializing Monorepo Time:', error);
        }
    },

    notes: '',
    noteNotFound: true,
    setNotes: (notes: string) => set({ notes }),
    loadNotes: async () => {
        try {
            const port = config.apiPort || 3000;
            const response = await fetch(`http://localhost:${port}/${apiRoute.notes}`);
            const data = await response.json();
            set({ notes: data.notes, noteNotFound: false });
        } catch (error) {
            set({ noteNotFound: true });
        }
    },
    saveNotes: async () => {
        // try {
        //     const port = config.apiPort || 3000;
        //     await fetch(`http://localhost:${port}/${apiRoute.saveNotes}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ notes: get().notes }),
        //     });
        // } catch (error) {
        //     console.error('Error saving notes:', error);
        // }
    }
}));

const useAppState = createSelectors(appstate);
export default useAppState;

