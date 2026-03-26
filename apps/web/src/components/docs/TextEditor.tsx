import { useEffect, useState } from "react";
import useProjectState from "../../appstates/docsBrowser";
import Button3 from "../ui/Button3";
import CustomAceEditor from "../lib/CustomAceEditor";

interface DiffMarkers { 
    added: number[];
    modified: number[];
}

export default function TextEditor() {
    const isFileEditorOpen = useProjectState.use.isFileEditorOpen();
    const currentFile      = useProjectState.use.currentFile();
    const currentFilePath  = useProjectState.use.currentFilePath();
    const curentFileType   = useProjectState.use.curentFileType();
    const loadProjectTree = useProjectState.use.loadProjectTree();
    const closeFileEditor  = useProjectState.use.closeFileEditor();
    const loadFile         = useProjectState.use.loadFile();
    const saveFile         = useProjectState.use.saveFile();
    const getFileDiff      = useProjectState.use.getFileDiff();
    const [textContent, setTextContent] = useState('');
    const [diffMarkers, setDiffMarkers] = useState<DiffMarkers | undefined>(undefined);
    const [selectedLines, setSelectedLines] = useState<{ start: number; end: number } | undefined>(undefined);

    useEffect(() => {
        if(isFileEditorOpen && currentFilePath) {
            // Load file content
            loadFile(currentFilePath).then((content) => {
                setTextContent(typeof content === 'string' ? content : "");
            });
            
            // Load git diff markers
            getFileDiff(currentFilePath).then((diff) => {
                if (diff && (diff.added?.length > 0 || diff.modified?.length > 0)) {
                    setDiffMarkers({
                        added: diff.added || [],
                        modified: diff.modified || []
                    });
                } else {
                    setDiffMarkers(undefined);
                }
            });
        } else {
            // Reset when editor closes
            setDiffMarkers(undefined);
        }
    }, [isFileEditorOpen, currentFilePath]);

    if (!isFileEditorOpen) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/20 italic">
                Select a file to edit
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full min-h-0 bg-gray-900/40 rounded overflow-hidden p-2">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-file-code text-blue-400"></i>
                    <span className="text-white font-medium">{currentFile}</span>
                    <span className="text-xs text-white/40 truncate max-w-[300px]">{currentFilePath}</span>
                </div>
                <div className="flex gap-2">
                    <Button3 
                        className="!w-24 !h-8"
                        onClick={() => {
                            if (!currentFilePath) return;
                            saveFile(currentFilePath, textContent);
                            loadProjectTree();
                        }}
                        text="Save"
                        icon="fa-solid fa-floppy-disk"
                    />
                    <button 
                        onClick={() => closeFileEditor()}
                        className="text-white/40 hover:text-white"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 text-md h-full min-h-0 relative">
                <CustomAceEditor
                    value={textContent}
                    transparent={true}
                    mode={
                        curentFileType === 'js' || curentFileType === 'jsx' ? 'javascript' : 
                        curentFileType === 'ts' || curentFileType === 'tsx' ? 'typescript' : 
                        curentFileType === 'md' ? 'markdown' :
                        'json'
                    }
                    height="100%"
                    width="100%"
                    onChange={(value) => {
                        setTextContent(value);
                    }}
                    diffMarkers={diffMarkers}
                    onSave={() => {
                        if (!currentFilePath) return;
                        saveFile(currentFilePath, textContent);
                        loadProjectTree();
                    }}
                    rightClickMenu={(_line :any, _column :any, _selectedText :any, selection :any) => {
                        if (selection) {
                            setSelectedLines({
                                start: selection.startLine,
                                end:   selection.endLine
                            });
                        }
                    }}
                    contextMenuComponent={
                        <div className="bg-gray-800 w-[200px] p-2 rounded-md border border-white/10 shadow-xl">
                            <button className="flex gap-2 w-full text-left p-2 rounded-md hover:bg-white/10 text-white"
                                onClick={() => {
                                    if (!currentFilePath) return;
                                    const event = new CustomEvent('opencode:terminal:type', {
                                        detail: "@" + 
                                                currentFilePath + 
                                                " Lines: " + 
                                                selectedLines?.start + 
                                                " - " + 
                                                selectedLines?.end
                                                + "\n"
                                    });
                                    window.dispatchEvent(event);
                                }}
                            >
                                <i className="fa-solid fa-code text-blue-400"></i>
                                <span className="text-sm">Chat About This</span>
                            </button>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
