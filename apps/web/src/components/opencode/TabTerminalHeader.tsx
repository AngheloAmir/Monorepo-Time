import type { TerminalInstance } from "./TerminalContainer";

interface TabTerminalHeaderProps {
    tabs: TerminalInstance[];
    activeTabId: string;
    setActiveTabId: (id: string) => void;
    closeTab: (id: string, e: React.MouseEvent) => void;
    addTab: () => void;
}

export default function TabTerminalHeader({ tabs, activeTabId, setActiveTabId, closeTab, addTab }: TabTerminalHeaderProps) {
    return (
        <div className="flex items-center bg-black/40 border-b border-white/10 overflow-x-auto">
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`
                                    group flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none
                                    border-r border-white/5 min-w-[120px] max-w-[200px]
                                    ${activeTabId === tab.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                                `}
                >
                    <span className="truncate flex-1">{tab.title}</span>
                    {tabs.length > 1 && (
                        <button
                            onClick={(e) => closeTab(tab.id, e)}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-0.5 rounded"
                        >
                            <i className="fa-solid fa-times text-xs"></i>
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={addTab}
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="New Terminal"
            >
                <i className="fa-solid fa-plus text-xs"></i>
            </button>
        </div>
    );
}