import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';
import type { AvailbleTemplates } from 'types';

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
    getTemplates: () => Promise<AvailbleTemplates>;

    terminalFontSize: number;
    loadTerminalFontSize: () => void;
    setTerminalFontSize: (size: number) => void;

    projectTreeFontSize: number;
    loadProjectTreeFontSize: () => void;
    setProjectTreeFontSize: (size: number) => void;

    showGit: boolean;
    setShowGit: (show: boolean) => void;
}

const appstate = create<appContext>()((set, get) => ({
    showTerminal: false,
    setShowTerminal: (show: boolean) => set({ showTerminal: show }),
    rootDir: '',
    showAboutModal: false,
    setShowAboutModal: (show: boolean) => set({ showAboutModal: show }),

    terminalFontSize: 15,
    setTerminalFontSize: (size: number) => {
        localStorage.setItem('terminalFontSize', size.toString());
        set({ terminalFontSize: size });
    },
    loadTerminalFontSize() {
        const fontSize = localStorage.getItem('terminalFontSize');
        if (fontSize) {
            set({ terminalFontSize: parseInt(fontSize) });
        }
    },

    showGit: false,
    setShowGit: (show: boolean) => set({ showGit: show }),

    projectTreeFontSize: 14,
    setProjectTreeFontSize: (size: number) => {
        localStorage.setItem('projectTreeFontSize', size.toString());
        set({ projectTreeFontSize: size });
    },
    loadProjectTreeFontSize() {
        const fontSize = localStorage.getItem('projectTreeFontSize');
        if (fontSize) {
            set({ projectTreeFontSize: parseInt(fontSize) });
        }
    },

    loadRootDir: async () => {
        if(config.useDemo) return;

        if (get().rootDir.length > 0) return;
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.getRootPath}`);
            const data = await response.json();
            set({ rootDir: data.path });
        } catch (err) {

        }
    },

    checkIfFirstTime: async () => {
        if(config.useDemo) return false;

        try {
            const response = await fetch(`${config.serverPath}${apiRoute.firstRun}`);
            const data = await response.json();
            return data.isFirstTime;
        } catch (error) {
            return false;
        }
    },

    initMonorepoTime: async () => {
        if(config.useDemo) return;

        try {
            await fetch(`${config.serverPath}${apiRoute.initMonorepoTime}`);
        } catch (error) {
            console.error('Error initializing Monorepo Time:', error);
        }
    },

    notes: '',
    noteNotFound: true,
    setNotes: (notes: string) => set({ notes }),
    loadNotes: async () => {
        if(config.useDemo) {
            set({ notes: 'Demo Mode is enabled\n\nThis is a demo version of the application.\n\nTo disable demo mode, please enable the `useDemo` flag in the `config.ts` file.', noteNotFound: false });
            return;
        }

        try {
            const response = await fetch(`${config.serverPath}${apiRoute.notes}`);

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
        if(config.useDemo) return;

        try {
            await fetch(`${config.serverPath}${apiRoute.notes}`, {
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
        if(config.useDemo) return { success: false, error: 'Demo Mode is enabled' };

        const response = await fetch(`${config.serverPath}${apiRoute.scaffoldRepo}`);
        const data = await response.json();
        return data;
    },

    hideShowFileFolder: async (filesShow: boolean, pathInclude: string[]) => {
        if(config.useDemo) return { isHidden: false };

        const response = await fetch(`${config.serverPath}${apiRoute.hideShowFileFolder}`, {
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
    },

    getTemplates: async () => {
        if(config.useDemo) return [];

        const response = await fetch(`${config.serverPath}${apiRoute.availabletemplates}`);
        const data = await response.json();
        return data;
    },

}));

const useAppState = createSelectors(appstate);
export default useAppState;
