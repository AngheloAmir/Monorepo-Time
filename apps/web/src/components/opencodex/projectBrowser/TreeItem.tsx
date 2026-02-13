import { useState } from "react";
import useAppState from "../../../appstates/app";
import useProjectState, { type ProjectTree, type Folder as FolderType, type File as FileType } from "../../../appstates/project";
import FileIcon from "./_fileIcon";
import EditDropdown from "./EditDropdown";
import Button3Mini from "../../ui/Button3Mini";

export default function TreeItem({ item, level = 0 }: { item: ProjectTree, level?: number }) {
    const projectTreeFontSize = useAppState.use.projectTreeFontSize();
    const [showDropdown, setShowDropdown] = useState(false);
    const isFolder = 'folder' in item;
    const path = isFolder ? (item as FolderType).path : (item as FileType).path;
    const isOpen = useProjectState(state => state.openFolders[path] || false);
    const toggleFolder = useProjectState.use.toggleFolder();
    const openFileEditor = useProjectState.use.openFileEditor();
    const isEditable = useProjectState.use.isEditable();

    const loadFile        = useProjectState.use.loadFile();
    const [textContent, setTextContent] = useState<string | null>(null);
    
    const setSelectedPath = useProjectState.use.setSelectedPath();
    const selectedPath    = useProjectState(state => state.selectedPath);

    const paddingLeft = level * 12 + 4;
    const name = isFolder ? (item as FolderType).folder : (item as FileType).file;
    const color = item.color;

    const isPasteProjecTextEnable = useProjectState.use.isPasteProjecTextEnable();

    const textColor = color === 'yellow' ?
        'text-yellow-400' : color === 'green' ?
            'text-green-400' : 'text-white/70';

    function preLoadTextContent( filepath: string ) {
        loadFile(filepath).then((data) => {
            setTextContent(data);
        });
    }

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
                        e.dataTransfer.setData("text/plain", `@${folder.path} \n`);
                        e.dataTransfer.effectAllowed = "copy";
                    }}
                >
                    <i className={`fa-solid ${isOpen ? 'fa-folder-open' : 'fa-folder'} text-blue-400/80 mr-2 text-[${projectTreeFontSize}px]`} />
                    <span className={`text-[${projectTreeFontSize}px] truncate ${textColor} group-hover:text-white`}>{name}</span>
                    
                    { selectedPath === path && <div className="flex-end ml-auto relative">
                        <Button3Mini
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                            }}
                            title="Edit"
                            icon="fas fa-pencil-alt text-xs"
                            className="!w-5 !h-5"
                        />
                        {showDropdown && (
                            <EditDropdown 
                                path={path} 
                                name={name} 
                                onClose={() => setShowDropdown(false)} 
                            />
                        )}
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
                    if(!isPasteProjecTextEnable) {
                        e.dataTransfer.setData("text/plain", `@${file.path} \n`);
                        e.dataTransfer.effectAllowed = "copy";
                    }
                    else {
                        e.dataTransfer.setData("text/plain", `${file.path}\n${textContent}\n\n` );
                        e.dataTransfer.effectAllowed = "copy";
                    }   
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPath(file.path);
                    if(isPasteProjecTextEnable) 
                        preLoadTextContent(file.path);
                    else 
                        setTextContent("");
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
                { selectedPath === path && <div className="flex-end ml-auto relative">
                        <Button3Mini
                            onClick={() => {
                                setShowDropdown(!showDropdown);
                            }}
                            title="Edit"
                            icon="fas fa-pencil-alt text-xs"
                            className="!w-5 !h-5"
                        />
                        {showDropdown && (
                            <EditDropdown 
                                path={path} 
                                name={name} 
                                onClose={() => setShowDropdown(false)} 
                            />
                        )}
                    </div>
                }
            </div>
        );
    }
};


