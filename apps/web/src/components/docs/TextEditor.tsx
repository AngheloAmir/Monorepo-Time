import { useEffect, useState } from "react";
import useDocsState, { type DocTab } from "../../appstates/docs";
import CustomAceEditor from "../lib/CustomAceEditor";
import FileViewer from "./FileViewer";

export default function TextEditor() {
    const tabs = useDocsState.use.tabs();
    const activeTabPath = useDocsState.use.activeTabPath();
    const setActiveTab = useDocsState.use.setActiveTab();
    const closeTab = useDocsState.use.closeTab();
    const updateTabContent = useDocsState.use.updateTabContent();
    const saveTab = useDocsState.use.saveTab();
    const isDirty = useDocsState.use.isDirty();
    const setLineHighlight = useDocsState.use.setLineHighlight();

    // Global Ctrl+S handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                if (activeTabPath) {
                    e.preventDefault();
                    saveTab(activeTabPath);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTabPath, saveTab]);

    if (tabs.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/20 italic bg-gray-900/40 rounded">
                Select a file to edit
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full min-h-0 bg-gray-900/40 rounded overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex bg-black/20 overflow-x-auto no-scrollbar border-b border-white/5">
                {tabs.map((tab) => (
                    <div
                        key={tab.path}
                        className={`
                            group flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-white/5 select-none transition-colors
                            ${activeTabPath === tab.path ? 'bg-white/10 text-white border-b border-b-blue-500' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}
                        `}
                        onClick={() => setActiveTab(tab.path)}
                    >
                        <i className={`fa-solid ${tab.viewMode === 'viewer' ? 'fa-eye' : 'fa-file-code'} text-xs ${activeTabPath === tab.path ? 'text-blue-400' : 'text-white/20'}`}></i>
                        <span className="text-xs truncate max-w-[150px]">{tab.title}</span>
                        
                        <div className="flex items-center justify-center w-4 h-4">
                            {isDirty(tab.path) ? (
                                <div className="w-2 h-2 bg-white rounded-full group-hover:hidden"></div>
                            ) : null}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(tab.path);
                                }}
                                className={`text-[10px] hover:bg-white/20 rounded h-4 w-4 flex items-center justify-center ${isDirty(tab.path) ? 'hidden group-hover:flex' : 'flex'}`}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                {tabs.map((tab) => (
                    <div
                        key={tab.path}
                        className={`absolute inset-0 ${activeTabPath === tab.path ? 'block' : 'hidden'}`}
                    >
                        {tab.viewMode === 'viewer' ? (
                            <FileViewer tab={tab} />
                        ) : (
                            <TabEditor 
                                tab={tab} 
                                updateTabContent={updateTabContent} 
                                saveTab={saveTab}
                                setLineHighlight={setLineHighlight}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function TabEditor({ tab, updateTabContent, saveTab, setLineHighlight }: { 
    tab: DocTab, 
    updateTabContent: (path: string, content: string) => void,
    saveTab: (path: string) => Promise<void>,
    setLineHighlight: (path: string, lines: number[], color: string | null) => void
}) {
    const [contextMenuProps, setContextMenuProps] = useState<{ line: number, selection?: { startLine: number, endLine: number } } | null>(null);

    const applyHighlight = (color: string | null) => {
        if (!contextMenuProps) return;
        
        let lines: number[] = [contextMenuProps.line];
        if (contextMenuProps.selection) {
            lines = [];
            for (let i = contextMenuProps.selection.startLine; i <= contextMenuProps.selection.endLine; i++) {
                lines.push(i);
            }
        }
        
        setLineHighlight(tab.path, lines, color);
    };

    return (
        <CustomAceEditor
            value={tab.content}
            transparent={true}
            mode={
                tab.type === 'js' || tab.type === 'jsx' ? 'javascript' : 
                tab.type === 'ts' || tab.type === 'tsx' ? 'typescript' : 
                tab.type === 'md' ? 'markdown' :
                'json'
            }
            height="100%"
            width="100%"
            onChange={(value) => {
                updateTabContent(tab.path, value);
            }}
            lineHighlights={tab.highlights}
            onSave={() => {
                saveTab(tab.path);
            }}
            rightClickMenu={(line: number, _col: any, _text: any, selection: any) => {
                setContextMenuProps({ line, selection });
            }}
            contextMenuComponent={
                <div className="bg-gray-800 w-[240px] p-1 rounded-md border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-100">
                    <button 
                        onClick={() => applyHighlight('green')}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-sm hover:bg-green-500/20 text-white/80 hover:text-white transition-colors"
                    >
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-sm">Highlight {contextMenuProps?.selection ? 'Selection' : 'Line'} Green</span>
                    </button>
                    <button 
                        onClick={() => applyHighlight('orange')}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-sm hover:bg-orange-500/20 text-white/80 hover:text-white transition-colors"
                    >
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                        <span className="text-sm">Highlight {contextMenuProps?.selection ? 'Selection' : 'Line'} Orange</span>
                    </button>
                    <button 
                        onClick={() => applyHighlight('yellow')}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-sm hover:bg-yellow-500/20 text-white/80 hover:text-white transition-colors"
                    >
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                        <span className="text-sm">Highlight {contextMenuProps?.selection ? 'Selection' : 'Line'} Yellow</span>
                    </button>
                    <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
                    <button 
                        onClick={() => applyHighlight(null)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-sm hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <i className="fa-solid fa-eraser text-xs w-3 text-center"></i>
                        <span className="text-sm">Remove Highlight</span>
                    </button>
                </div>
            }
        />
    );
}
