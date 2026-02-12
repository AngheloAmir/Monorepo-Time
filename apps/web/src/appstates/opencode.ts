import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { TerminalInstance } from '../components/opencode/TerminalContainer';
import React from 'react';

interface OpenCodeState {
    sidebarWidth: number;
    isResizing: boolean;
    projectTreeInterval: any;
    tabsCount: number;
    tabs: TerminalInstance[];
    activeTabId: string;

    setSidebarWidth: (width: number) => void;
    setIsResizing: (isResizing: boolean) => void;
    setProjectTreeInterval: (interval: any) => void;
    setTabs: (tabs: TerminalInstance[]) => void;
    setActiveTabId: (id: string) => void;
    addTab: () => void;
    closeTab: (id: string, e: React.MouseEvent) => void;
}

const useOpenCodeBase = create<OpenCodeState>((set) => ({
    sidebarWidth:  285,
    isResizing:    false,
    projectTreeInterval: null,

    tabsCount:     1,
    tabs: [{ id: '1', title: 'Terminal 1' }],
    activeTabId: '1',

    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    setIsResizing: (isResizing: boolean) => set({ isResizing: isResizing }),
    setProjectTreeInterval: (interval: any) => set({ projectTreeInterval: interval }),
    setTabs: (tabs: TerminalInstance[]) => set({ tabs: tabs }),
    setActiveTabId: (id: string) => set({ activeTabId: id }),

    addTab: () => set((state) => {
        const newId = String(Date.now());
        const newTab = { id: newId, title: `Terminal ${state.tabsCount + 1}` };
        return {
            tabsCount: state.tabsCount + 1,
            tabs:      [...state.tabs, newTab],
            activeTabId: newId,
        };
    }),

    closeTab: (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        set((state) => {
            if (state.tabs.length === 1) return {}; // Don't close last tab
            
            const newTabs = state.tabs.filter(t => t.id !== id);
            let newActiveId = state.activeTabId;

            if (state.activeTabId === id) {
                newActiveId = newTabs[newTabs.length - 1].id;
            }

            return {
                tabs: newTabs,
                activeTabId: newActiveId
            };
        });
    },
}));

const useOpenCode = createSelectors(useOpenCodeBase);
export default useOpenCode;
