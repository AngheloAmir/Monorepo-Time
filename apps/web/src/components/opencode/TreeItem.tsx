import useProjectState, { type ProjectTree, type Folder as FolderType, type File as FileType } from "../../appstates/project";

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

export default function TreeItem({ item, level = 0 }: { item: ProjectTree, level?: number }) {
    const isFolder = 'folder' in item;
    const path = isFolder ? (item as FolderType).path : (item as FileType).path;
    const isOpen = useProjectState(state => state.openFolders[path] || false);
    const toggleFolder = useProjectState.use.toggleFolder();
    
    const paddingLeft = level * 12 + 4;
    const name = isFolder ? (item as FolderType).folder : (item as FileType).file;
    const color = item.color;

    const textColor = color === 'yellow' ? 
        'text-yellow-400' : color === 'green' ? 
            'text-green-400' : 'text-white/70';

    if (isFolder) {
        const folder = item as FolderType;
        return (
            <div>
                <div 
                    className="flex items-center py-0.5 px-2 hover:bg-white/[0.05] cursor-pointer select-none group"
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={() => toggleFolder(path)}
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", folder.path);
                        e.dataTransfer.effectAllowed = "copy";
                    }}
                >
                    <i className={`fa-solid fa-chevron-right text-[10px] text-white/30 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    <i className={`fa-solid ${isOpen ? 'fa-folder-open' : 'fa-folder'} text-blue-400/80 mr-2 text-xs`} />
                    <span className={`text-xs truncate ${textColor} group-hover:text-white`}>{name}</span>
                    {color !== 'none' && <div className={`ml-auto w-1.5 h-1.5 rounded-full ${color === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>}
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
                {color !== 'none' && <div className={`ml-auto text-[10px] font-bold ${color === 'blue' ? 'text-blue-400' : color === 'orange' ? 'text-orange-400' : 'text-green-400'}`}>
                    {color === 'orange' ? 'M' : color === 'green' ? 'U' : ''}
                </div>}
            </div>
        );
    }
};
