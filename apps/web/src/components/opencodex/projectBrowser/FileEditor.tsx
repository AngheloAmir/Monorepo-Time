import { useEffect, useState } from "react";
import useProjectState from "../../../appstates/project";
import Button3 from "../../ui/Button3";
import ButtonDefault from "../../ui/ButtonDefault";
import ModalBody from "../../ui/ModalBody";
import ModalHeader from "../../ui/ModalHeader";
import CustomAceEditor from "../../lib/CustomAceEditor";

interface DiffMarkers {
    added: number[];
    modified: number[];
}

export default function FileEditor() {
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

    if (isFileEditorOpen) return (
        <ModalBody width="1200px">
            <ModalHeader
                title={currentFile}
                description={currentFilePath}
                close={() => closeFileEditor()}
                icon="fa-solid fa-file-code"
            />
            <div className="p-2 flex-1 text-md h-full">
                <CustomAceEditor
                    value={textContent}
                    transparent={true}
                    mode={
                        curentFileType === 'js' || curentFileType === 'jsx' ? 'javascript' : 
                        curentFileType === 'ts' || curentFileType === 'tsx' ? 'typescript' : 
                        'json'
                    }
                    height="60vh"
                    width="100%"
                    onChange={(value) => {
                        setTextContent(value);
                    }}
                    diffMarkers={diffMarkers}
                    onSave={() => {
                        if (!currentFilePath) return;
                        saveFile(currentFilePath, textContent);
                        closeFileEditor();
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
                        <div className="bg-gray-800 w-[200px] p-2 rounded-md">
                            <button className="flex gap-2 w-full text-left p-2 rounded-md hover:bg-gray-700"
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
                                    closeFileEditor();
                                }}
                            >
                                <i className="fa-solid fa-code"></i>
                                <span className="text-sm">Chat About This</span>
                            </button>
                        </div>
                    }
                />
            </div>

            <div className="flex justify-end gap-2 p-3">
                <ButtonDefault onClick={() => closeFileEditor()} text="Close" />
                <Button3 
                    className="w-[200px]"
                    onClick={() => {
                        if (!currentFilePath) return;
                        saveFile(currentFilePath, textContent);
                        closeFileEditor();
                        loadProjectTree();
                    }}
                    text="Save (Ctrl + S)"
                    icon="fa-solid fa-floppy-disk"
                />
            </div>
        </ModalBody>
    );
}