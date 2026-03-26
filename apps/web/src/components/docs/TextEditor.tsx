import { useEffect, useState } from "react";
import useDocsState, { type DocTab } from "../../appstates/docs";
import CustomAceEditor from "../lib/CustomAceEditor";
import useProjectState from "../../appstates/docsBrowser";

export default function TextEditor() {
    const tabs = useDocsState.use.tabs();
    const activeTabPath = useDocsState.use.activeTabPath();
    const setActiveTab = useDocsState.use.setActiveTab();
    const closeTab = useDocsState.use.closeTab();
    const updateTabContent = useDocsState.use.updateTabContent();
    const saveTab = useDocsState.use.saveTab();
    const isDirty = useDocsState.use.isDirty();
    const getFileDiff = useProjectState.use.getFileDiff();

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
                        <i className={`fa-solid fa-file-code text-xs ${activeTabPath === tab.path ? 'text-blue-400' : 'text-white/20'}`}></i>
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
                        <TabEditor 
                            tab={tab} 
                            updateTabContent={updateTabContent} 
                            saveTab={saveTab}
                            getFileDiff={getFileDiff}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TabEditor({ tab, updateTabContent, saveTab, getFileDiff }: { 
    tab: DocTab, 
    updateTabContent: (path: string, content: string) => void,
    saveTab: (path: string) => Promise<void>,
    getFileDiff: (path: string) => Promise<any>
}) {
    const [diffMarkers, setDiffMarkers] = useState<any>(undefined);

    useEffect(() => {
        getFileDiff(tab.path).then((diff) => {
            if (diff && (diff.added?.length > 0 || diff.modified?.length > 0)) {
                setDiffMarkers({
                    added: diff.added || [],
                    modified: diff.modified || []
                });
            } else {
                setDiffMarkers(undefined);
            }
        });
    }, [tab.path, getFileDiff]);

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
            diffMarkers={diffMarkers}
            onSave={() => {
                saveTab(tab.path);
            }}
            rightClickMenu={(_line: any, _column: any, _selectedText: any, selection: any) => {
                if (selection) {
                    const event = new CustomEvent('opencode:terminal:type', {
                        detail: "@" + 
                                tab.path + 
                                " Lines: " + 
                                selection.startLine + 
                                " - " + 
                                selection.endLine
                                + "\n"
                    });
                    window.dispatchEvent(event);
                }
            }}
            contextMenuComponent={
                <div className="bg-gray-800 w-[200px] p-2 rounded-md border border-white/10 shadow-xl">
                    <button className="flex gap-2 w-full text-left p-2 rounded-md hover:bg-white/10 text-white">
                        <i className="fa-solid fa-code text-blue-400"></i>
                        <span className="text-sm italic">Context Menu Actions</span>
                    </button>
                </div>
            }
        />
    );
}
