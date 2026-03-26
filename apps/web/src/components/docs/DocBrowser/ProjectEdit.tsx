import useProjectState from "../../../appstates/docsBrowser";
import useModal from "../../../modal/modals";
import Button3Mini from "../../ui/Button3Mini";

export default function ProjectEdit() {
    const changesCount = useProjectState.use.changes();
    const loadProjectTree = useProjectState.use.loadProjectTree();
    const showModal = useModal.use.showModal();
    const selectedFolder = useProjectState.use.selectedFolder();
    const createNewFolder = useProjectState.use.createNewFolder();
    const createNewFile = useProjectState.use.createNewFile();
    const getParentPath = useProjectState.use.getParentPath();

    const isPasteProjecTextEnable    = useProjectState.use.isPasteProjecTextEnable();
    const setIsPasteProjecTextEnable = useProjectState.use.setIsPasteProjecTextEnable();

    async function onFolder() {
        showModal("prompt", "New Folder", `Create a new folder at ${selectedFolder}`, "success", async (newName: any) => {
            if (newName) {
                const parentPath = getParentPath();
                const fullPath = `${parentPath}/${newName}`;
                await createNewFolder(fullPath);
                loadProjectTree();
            }
        });
    }

    async function onFile() {
        showModal("prompt", "New File", `Create a new file at ${selectedFolder}`, "success", async (newName: any) => {
            if (newName) {
                const parentPath = getParentPath();
                const fullPath = `${parentPath}/${newName}`;
                await createNewFile(fullPath);
                loadProjectTree();
            }
        });
    }

    return (
        <div className="flex items-center justify-between p-2">
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">
                {changesCount} change{changesCount > 1 ? "s" : ""}
            </div>

            <div className='flex flex-end gap-2'>

                <Button3Mini
                    onClick={onFile}
                    title="New File"
                    icon="fas fa-file text-xs"
                />

                <Button3Mini
                    onClick={onFolder}
                    title="New Folder"
                    icon="fas fa-folder text-xs"
                />

                <Button3Mini
                    onClick={() => setIsPasteProjecTextEnable(!isPasteProjecTextEnable)}
                    title={
                        isPasteProjecTextEnable ? 
                            "Will Paste Project Text" :
                            "Paste @<path>"
                    }
                    icon="fas fa-paste text-xs"
                    className={isPasteProjecTextEnable ? 
                        "bg-red-600" :
                        ""
                    }
                />
            </div>

        </div>
    );
}
