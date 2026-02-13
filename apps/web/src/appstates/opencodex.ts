import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

interface OpencodeXState {
    sidebarWidth: number;
    isResizing: boolean;

    setSidebarWidth: (width: number) => void;
    setIsResizing: (isResizing: boolean) => void;
}

const useOpencodeXBase = create<OpencodeXState>((set) => ({
    sidebarWidth: 285,
    isResizing: false,

    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    setIsResizing: (isResizing: boolean) => set({ isResizing: isResizing }),
}));

const useOpencodeX = createSelectors(useOpencodeXBase);
export default useOpencodeX;
