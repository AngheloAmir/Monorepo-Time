import useGitStash from "../../../appstates/gitstash";
import useProjectState from "../../../appstates/project";
import useAppState from "../../../appstates/app";
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
    const stashCount    = useGitStash.use.stashCount();

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
                <div className="relative">
                    <Button3Mini
                        onClick={() => useAppState.use.setShowGit()(true)}
                        title="Git Stash"
                        icon="fa-solid fa-clock-rotate-left text-xs"
                    />
                    {stashCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/30 pointer-events-none">
                            {stashCount}
                        </span>
                    )}
                </div>

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
