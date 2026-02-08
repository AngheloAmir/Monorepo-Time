import { useEffect, useState } from "react";
import useProjectState, { type ProjectTree, type Folder as FolderType, type File as FileType } from "../../appstates/project";
import useGitControlContext from "../../appstates/gitcontrol";
import config from 'config';

interface ProjectBrowserProps {
    className?: string;
}

const FileIcon = ({ name }: { name: string }) => {
    const ext = name.split('.').pop()?.toLowerCase();
    let iconClass = "fa-solid fa-file text-white/40";
    
    switch(ext) {
        case 'ts':
        case 'tsx':
            iconClass = "fa-solid fa-file-code text-blue-400";
            break;
        case 'js':
        case 'jsx':
            iconClass = "fa-brands fa-js text-yellow-400";
            break;
        case 'json':
            iconClass = "fa-solid fa-file-code text-yellow-200";
            break;
        case 'css':
        case 'scss':
            iconClass = "fa-brands fa-css3 text-blue-300";
            break;
        case 'html':
            iconClass = "fa-brands fa-html5 text-orange-400";
            break;
        case 'md':
            iconClass = "fa-brands fa-markdown text-white/60";
            break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
            iconClass = "fa-solid fa-image text-purple-400";
            break;
    }
    
    return <i className={`${iconClass} w-4 text-center`} />;
};

const TreeItem = ({ item, level = 0 }: { item: ProjectTree, level?: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const paddingLeft = level * 12 + 4;

    const isFolder = 'folder' in item;
    const name = isFolder ? (item as FolderType).folder : (item as FileType).file;
    const color = item.color;

    const textColor = color === 'orange' ? 'text-orange-400' : color === 'green' ? 'text-green-400' : 'text-white/70';

    if (isFolder) {
        const folder = item as FolderType;
        return (
            <div>
                <div 
                    className="flex items-center py-0.5 px-2 hover:bg-white/[0.05] cursor-pointer select-none group"
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <i className={`fa-solid fa-chevron-right text-[10px] text-white/30 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    <i className={`fa-solid ${isOpen ? 'fa-folder-open' : 'fa-folder'} text-blue-400/80 mr-2 text-xs`} />
                    <span className={`text-xs truncate ${textColor} group-hover:text-white`}>{name}</span>
                    {color !== 'none' && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${color === 'orange' ? 'bg-orange-400' : 'bg-green-400'}`}></div>}
                </div>
                {isOpen && (
                    <div>
                        {folder.content.map((child, i) => (
                            <TreeItem key={i} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    } else {
        const file = item as FileType;
        return (
            <div 
                className="flex items-center py-0.5 px-2 hover:bg-white/[0.05] cursor-pointer select-none group"
                style={{ paddingLeft: `${paddingLeft}px` }}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", file.path);
                    e.dataTransfer.effectAllowed = "copy";
                }}
            >
                <div className="w-4" /> {/* Spacer for chevron */}
                <span className="mr-2 text-xs"><FileIcon name={name} /></span>
                <span className={`text-xs truncate ${textColor} group-hover:text-white`}>{name}</span>
                {color !== 'none' && <div className={`ml-auto text-[10px] font-bold ${color === 'orange' ? 'text-orange-400' : 'text-green-400'}`}>
                    {color === 'orange' ? 'M' : 'U'}
                </div>}
            </div>
        );
    }
};

export default function ProjectBrowser(props: ProjectBrowserProps) {
    const projectTree    = useProjectState.use.projectTree();
    const loadProjectTree = useProjectState.use.loadProjectTree();
    
    // Git Control
    const handleCommit     = useGitControlContext.use.handleCommit();
    const commitMessage    = useGitControlContext.use.commitMessage();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    const commitLoading    = useGitControlContext.use.commitLoading();

    useEffect(() => {
        loadProjectTree();
    }, []);

    return (
        <div className={`flex flex-col h-full min-h-0 bg-black/20 rounded border border-white/[0.05] ${props.className}`}>
            <div className="flex items-center justify-between p-2 border-b border-white/[0.05]">
                <div className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">
                    Explorer
                </div>
                <div 
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 cursor-pointer text-white/40 hover:text-white transition-colors"
                    onClick={() => loadProjectTree()}
                    title="Refresh"
                >
                    <i className="fa-solid fa-arrows-rotate text-xs"></i>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-1">
                {projectTree && projectTree.length > 0 ? (
                     projectTree.map((item, i) => (
                        <TreeItem key={i} item={item} />
                    ))
                ) : (
                    <div className="p-4 text-center text-white/20 text-xs italic">
                        {config.useDemo ? "Demo Mode - No Project" : "Loading or empty..."}
                    </div>
                )}
            </div>

            {/* Commit and Push Section */}
            <div className="p-2 border-t border-white/[0.05] bg-black/20">
                <form 
                    onSubmit={(e) => {
                        e.preventDefault(); 
                        handleCommit(e);
                    }}
                    className="flex flex-col gap-2"
                >
                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                        Source Control
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                            placeholder="Message"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            disabled={commitLoading}
                        />
                        <button 
                            type="submit"
                            disabled={commitLoading || !commitMessage.trim()}
                            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Commit & Push"
                        >
                            {commitLoading ? <i className="fa-solid fa-spinner fa-spin duration-75" /> : <i className="fa-solid fa-cloud-arrow-up" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}