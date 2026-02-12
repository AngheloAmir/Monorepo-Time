import { useEffect } from "react";
import useAppState from "../../appstates/app";
import ProjectBrowser from "../opencode/ProjectBrowser";
import useProjectState from "../../appstates/project";
import FileEditor from "../opencode/FileEditor";
import useGitStash from "../../appstates/gitstash";
import ContentContainer from "../opencode/ContentContainer";
import useOpenCode from "../../appstates/opencode";

interface OpenCodeProps {
    isVisible: boolean
}

export default function OpenCode(props: OpenCodeProps) {
    const checkIfInstalled           = useAppState.use.checkIfInstalled();
    const loadRootDir                = useAppState.use.loadRootDir();
    const loadProjectTree            = useProjectState.use.loadProjectTree();
    const loadGitStashList           = useGitStash.use.loadGitStashList();
    
    const sidebarWidth          = useOpenCode.use.sidebarWidth();
    const setSidebarWidth       = useOpenCode.use.setSidebarWidth();
    const isResizing            = useOpenCode.use.isResizing();
    const setIsResizing         = useOpenCode.use.setIsResizing();
    const projectTreeInterval   = useOpenCode.use.projectTreeInterval();
    const setProjectTreeInterval= useOpenCode.use.setProjectTreeInterval();

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

            const intervalId = setInterval(() => {
                loadProjectTree();
                loadGitStashList();
            }, 5000);
            setProjectTreeInterval(intervalId);
        }
        else {
            if (projectTreeInterval) clearInterval(projectTreeInterval);
        }
    }, [props.isVisible]);

    useEffect(() => {
        checkIfInstalled();
        loadRootDir();
        loadProjectTree();
        loadGitStashList();
        return () => {
            if (projectTreeInterval) clearInterval(projectTreeInterval);
        }
    }, []);

    return (
        <div className={`h-full w-full p-2 gap-2 ${props.isVisible ? 'flex' : 'hidden'} ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
            <div className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0" style={{ width: sidebarWidth }}>
                <ProjectBrowser />
            </div>
            <div className="w-1 h-full cursor-col-resize hover:bg-white/20 active:bg-blue-500 transition-colors rounded-full" onMouseDown={() => setIsResizing(true)} />

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden">
                <ContentContainer isVisible={props.isVisible} />
                <FileEditor />
            </div>
        </div>
    )
}
