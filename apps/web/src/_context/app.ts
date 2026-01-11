import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config   from 'config';

interface appContext {
    showTerminal: boolean;
    setShowTerminal: (show: boolean) => void;
    rootDir: string;
    loadRootDir: () => Promise<void>;
}

const appstate = create<appContext>()((set, get) => ({
    showTerminal: false,
    setShowTerminal: (show: boolean) => set({ showTerminal: show }),
    rootDir: '',
    loadRootDir: async () => {
        if (get().rootDir.length > 0) return;
        const port     = config.apiPort || 3000;
        const response = await fetch(`http://localhost:${port}/${apiRoute.getRootPath}`);
        const data     = await response.json();
        set({ rootDir: data.path });
    }
}));

const useAppState = createSelectors(appstate);
export default useAppState;

