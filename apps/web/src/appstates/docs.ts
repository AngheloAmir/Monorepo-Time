import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import useProjectState from './docsBrowser';

export interface DocTab {
    path: string;
    title: string;
    content: string;
    originalContent: string;
    type: string;
    highlights: Record<number, string>;
}

interface DocsContext {
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
    
    tabs: DocTab[];
    activeTabPath: string | null;
    
    openTab: (path: string) => Promise<void>;
    closeTab: (path: string) => void;
    setActiveTab: (path: string) => void;
    updateTabContent: (path: string, content: string) => void;
    saveTab: (path: string) => Promise<void>;
    isDirty: (path: string) => boolean;
    setLineHighlight: (path: string, lines: number[], color: string | null) => void;
}

const docsState = create<DocsContext>()((set, get) => ({
    sidebarWidth: 300,
    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    
    tabs: [],
    activeTabPath: null,

    openTab: async (path: string) => {
        const { tabs } = get();
        const existingTab = tabs.find(t => t.path === path);
        
        if (existingTab) {
            set({ activeTabPath: path });
            return;
        }

        // Load file content
        const projectState = useProjectState.getState();
        const response: any = await projectState.loadFile(path, true); // Assuming loadFile can return full response
        const content = response.content;
        const metadata = response.metadata || {};
        const highlights = metadata.highlights || {};

        const fileName = path.split('/').pop() || "";
        const fileType = path.split('.').pop() || "";

        const newTab: DocTab = {
            path,
            title: fileName,
            content: typeof content === 'string' ? content : "",
            originalContent: typeof content === 'string' ? content : "",
            type: fileType,
            highlights: highlights
        };

        set({
            tabs: [...tabs, newTab],
            activeTabPath: path
        });
    },

    closeTab: (path: string) => {
        const { tabs, activeTabPath } = get();
        const newTabs = tabs.filter(t => t.path !== path);
        let newActivePath = activeTabPath;

        if (activeTabPath === path) {
            newActivePath = newTabs.length > 0 ? newTabs[newTabs.length - 1].path : null;
        }

        set({
            tabs: newTabs,
            activeTabPath: newActivePath
        });
    },

    setActiveTab: (path: string) => set({ activeTabPath: path }),

    updateTabContent: (path: string, content: string) => {
        const { tabs } = get();
        const newTabs = tabs.map(t => t.path === path ? { ...t, content } : t);
        set({ tabs: newTabs });
    },

    saveTab: async (path: string) => {
        const { tabs } = get();
        const tab = tabs.find(t => t.path === path);
        if (!tab) return;

        const projectState = useProjectState.getState();
        await projectState.saveFile(path, tab.content, { highlights: tab.highlights });
        
        const newTabs = tabs.map(t => t.path === path ? { ...t, originalContent: t.content } : t);
        set({ tabs: newTabs });
        
        // Also reload project tree to show colors if needed
        projectState.loadProjectTree();
    },

    isDirty: (path: string) => {
        const { tabs } = get();
        const tab = tabs.find(t => t.path === path);
        return tab ? tab.content !== tab.originalContent : false;
    },

    setLineHighlight: (path: string, lines: number[], color: string | null) => {
        const { tabs } = get();
        const newTabs = tabs.map(t => {
            if (t.path === path) {
                const newHighlights = { ...t.highlights };
                lines.forEach(line => {
                    if (color) {
                        newHighlights[line] = color;
                    } else {
                        delete newHighlights[line];
                    }
                });
                return { ...t, highlights: newHighlights };
            }
            return t;
        });
        set({ tabs: newTabs });
    }
}));

const useDocsState = createSelectors(docsState);
export default useDocsState;
export type { DocsContext };
