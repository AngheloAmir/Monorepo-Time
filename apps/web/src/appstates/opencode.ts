import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

interface OpencodeState {
    sidebarWidth: number;
    isResizing: boolean;
    setSidebarWidth: (width: number) => void;
    setIsResizing: (isResizing: boolean) => void;

    //Opencode TUI handling
}

const useOpencodeBase = create<OpencodeState>((set) => ({
    sidebarWidth: 285,
    isResizing: false,
    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    setIsResizing: (isResizing: boolean) => set({ isResizing: isResizing }),
}));

const useOpencode = createSelectors(useOpencodeBase);
export default useOpencode;
