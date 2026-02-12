import { useEffect, useState } from "react";
import useAppState from "../../appstates/app";
import ProjectBrowser from "../opencode/ProjectBrowser";
import useProjectState from "../../appstates/project";
import FileEditor from "../opencode/FileEditor";
import useGitStash from "../../appstates/gitstash";
import OpenCodeInitMessage from "../opencode/OpenCodeInit";
import { TerminalTabContent, type TerminalInstance } from "../opencode/TerminalContainer";
import TabTerminalHeader from "../opencode/TabTerminalHeader";

interface OpenCodeProps {
    isVisible: boolean
}

export default function OpenCode(props: OpenCodeProps) {
    const isOpenCodeInstalled = useAppState.use.isOpenCodeInstalled();
    const loadingIfOpenCodeInstalled = useAppState.use.loadingIfOpenCodeInstalled();
    const checkIfInstalled = useAppState.use.checkIfInstalled();
    const rootDir = useAppState.use.rootDir();
    const loadRootDir = useAppState.use.loadRootDir();
    const loadProjectTree = useProjectState.use.loadProjectTree();
    const loadGitStashList = useGitStash.use.loadGitStashList();

    const [sidebarWidth, setSidebarWidth]               = useState(285);
    const [isResizing, setIsResizing]                   = useState(false);
    const [projectTreeInterval, setProjectTreeInterval] = useState<any>(null);
    const [tabs, setTabs]                               = useState<TerminalInstance[]>([{ id: '1', title: 'Terminal 1' }]);
    const [activeTabId, setActiveTabId]                 = useState<string>('1');

    const addTab = () => {
        const newId = String(Date.now());
        const newTab = { id: newId, title: `Terminal ${tabs.length + 1}` };
        setTabs([...tabs, newTab]);
        setActiveTabId(newId);
    };

    const closeTab = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (tabs.length === 1) return; // Don't close last tab
        
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth > 150 && newWidth < 600) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        if (props.isVisible) {
            checkIfInstalled();
            loadRootDir();
            loadProjectTree();
            loadGitStashList();
        }
    }, [props.isVisible]);

    useEffect(() => {
        checkIfInstalled();
        loadRootDir();
        loadProjectTree();
        loadGitStashList();
        return () => {
            clearInterval(projectTreeInterval);
        }
    }, []);

    useEffect(() => {
        if (props.isVisible) {
            const intervalId = setInterval(() => {
                loadProjectTree();
                loadGitStashList();
            }, 5000);
            setProjectTreeInterval(intervalId);
        }
        else
            clearInterval(projectTreeInterval);
    }, [props.isVisible]);

    return (
        <div className={`h-full w-full p-2 gap-2 ${props.isVisible ? 'flex' : 'hidden'} ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
            <div className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0" style={{ width: sidebarWidth }}>
                <ProjectBrowser />
            </div>
            <div className="w-1 h-full cursor-col-resize hover:bg-white/20 active:bg-blue-500 transition-colors rounded-full" onMouseDown={() => setIsResizing(true)} />

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <TabTerminalHeader
                        tabs={tabs}
                        activeTabId={activeTabId}
                        setActiveTabId={setActiveTabId}
                        closeTab={closeTab}
                        addTab={addTab}
                    />

                    <div className="flex-1 min-h-0 relative">
                        {tabs.map(tab => (
                            <TerminalTabContent
                                key={tab.id}
                                id={tab.id}
                                isActive={activeTabId === tab.id}
                                isVisible={props.isVisible}
                                rootDir={rootDir}
                                isOpenCodeInstalled={isOpenCodeInstalled}
                                loadingIfOpenCodeInstalled={loadingIfOpenCodeInstalled}
                            />
                        ))}
                        <OpenCodeInitMessage
                            isVisible={props.isVisible && !isOpenCodeInstalled && !loadingIfOpenCodeInstalled}
                            onInstall={() => {
                                useAppState.getState().installOpenCode();
                                checkIfInstalled();
                                loadRootDir();
                            }}
                        />
                    </div>
                </div>

                <FileEditor />
            </div>
        </div>
    )
}
