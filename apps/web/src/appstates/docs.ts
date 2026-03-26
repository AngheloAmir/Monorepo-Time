import { create } from 'zustand';
import { createSelectors } from './zustandSelector';

interface DocsContext {
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
    sample: () => Promise<void>;
}

const docsState = create<DocsContext>()((set) => ({
    sidebarWidth: 300,
    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    sample: async () => {
        // Sample implementation
    },
}));

const useDocsState = createSelectors(docsState);
export default useDocsState;
