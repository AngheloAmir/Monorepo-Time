import useAppState from "../../appstates/app";
import useProjectState, { type ProjectTree, type Folder as FolderType, type File as FileType } from "../../appstates/project";

const FileIcon = ({ name }: { name: string }) => {
    const ext = name.split('.').pop()?.toLowerCase();
    let iconClass = "fa-solid fa-file text-white/40";

    switch (ext) {
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
    const projectTreeFontSize = useAppState.use.projectTreeFontSize();
    const isFolder = 'folder' in item;
    const path = isFolder ? (item as FolderType).path : (item as FileType).path;
    const isOpen = useProjectState(state => state.openFolders[path] || false);
    const toggleFolder = useProjectState.use.toggleFolder();
    const openFileEditor = useProjectState.use.openFileEditor();
    const isEditable = useProjectState.use.isEditable();

    const setSelectedPath = useProjectState.use.setSelectedPath();
    const selectedPath = useProjectState(state => state.selectedPath);

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
                    className={`
                        flex  py-0.5 px-2 hover:bg-white/[0.05] cursor-pointer select-none group
                        ${selectedPath === path ? 'bg-blue-400/8' : ''}
                    `}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFolder(path);
                        setSelectedPath(path);
                    }}
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", folder.path);
                        e.dataTransfer.effectAllowed = "copy";
                    }}
                >
                    {/* <i className={`fa-solid fa-chevron-right text-[${projectTreeFontSize}px] text-white/30 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} /> */}
                    <i className={`fa-solid ${isOpen ? 'fa-folder-open' : 'fa-folder'} text-blue-400/80 mr-2 text-[${projectTreeFontSize}px]`} />
                    <span className={`text-[${projectTreeFontSize}px] truncate ${textColor} group-hover:text-white`}>{name}</span>
                    
                    { selectedPath === path && <div className="flex-end ml-auto">
                        <button
                            onClick={() => { }}
                            className={`w-5 h-5 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                            title="Edit"
                        >
                            <i className="fas fa-pencil-alt text-xs"></i>
                        </button>
                    </div>
                }

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
                className={`
                    flex items-center py-0.5 px-2 hover:bg-white/[0.05] cursor-pointer select-none group
                    ${selectedPath === file.path ? 'bg-blue-400/8' : ''}
                `}
                style={{ paddingLeft: `${paddingLeft}px` }}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", file.path);
                    e.dataTransfer.effectAllowed = "copy";
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPath(file.path);
                }}
                onDoubleClick={(e) => {
                    e.preventDefault();
                    const filePath = file.path.replace('@', '');
                    if (!isEditable(filePath)) return;
                    openFileEditor(filePath);
                }}
            >
                <div className="w-4" />
                <span className={`mr-2 text-[${projectTreeFontSize}px]`}>
                    <FileIcon name={name} />
                </span>
                <span className={`text-[${projectTreeFontSize}px] truncate ${textColor} group-hover:text-white`}>{name}</span>
                {color !== 'none' && <div className={`ml-auto text-[${projectTreeFontSize}px] font-bold ${color === 'blue' ? 'text-blue-400' : color === 'orange' ? 'text-orange-400' : 'text-green-400'}`}>
                    {color === 'orange' ? 'M' : color === 'green' ? 'U' : ''}
                </div>}

                { selectedPath === path && <div className="flex-end ml-auto">
                        <button
                            onClick={() => { }}
                            className={`w-5 h-5 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                            title="Edit"
                        >
                            <i className="fas fa-pencil-alt text-xs"></i>
                        </button>
                    </div>
                }
            </div>
        );
    }
};
