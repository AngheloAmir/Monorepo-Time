import { useEffect, useState } from "react";
import useProjectState from "../../appstates/project";
import CustomAceEditor from "../crud/CustomAceEditor";
import Button3 from "../ui/Button3";
import ButtonDefault from "../ui/ButtonDefault";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";

export default function FileEditor() {
    const isFileEditorOpen = useProjectState.use.isFileEditorOpen();
    const currentFile      = useProjectState.use.currentFile();
    const currentFilePath  = useProjectState.use.currentFilePath();
    const curentFileType   = useProjectState.use.curentFileType();
    const closeFileEditor  = useProjectState.use.closeFileEditor();
    const loadFile         = useProjectState.use.loadFile();
    const saveFile         = useProjectState.use.saveFile();
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        if(isFileEditorOpen && currentFilePath) {
            loadFile(currentFilePath).then((content) => {
                setTextContent(typeof content === 'string' ? content : "");
            });
        }
    }, [isFileEditorOpen, currentFilePath]);

    if (isFileEditorOpen) return (
        <ModalBody width="900px">
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
                    height="50vh"
                    width="100%"
                    onChange={(value) => {
                        setTextContent(value);
                    }}
                />
            </div>

            <div className="flex justify-end gap-2 p-3">
                <ButtonDefault onClick={() => closeFileEditor()} text="Close" />
                <Button3 
                    className="w-[150px]"
                    onClick={() => {
                        if (!currentFilePath) return;
                        saveFile(currentFilePath, textContent);
                        closeFileEditor();
                    }}
                    text="Save"
                    icon="fa-solid fa-floppy-disk"
                />
            </div>
        </ModalBody>
    );
}