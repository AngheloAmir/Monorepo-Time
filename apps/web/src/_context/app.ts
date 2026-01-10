import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

interface appContext {
    showTerminal: boolean;
    setShowTerminal: (show: boolean) => void;
}

const appstate = create<appContext>()((set) => ({
    showTerminal: false,
    setShowTerminal: (show: boolean) => set({ showTerminal: show })
}));

const useAppState = createSelectors(appstate);
export default useAppState;

