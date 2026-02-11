import useGitStash from "../../appstates/gitstash";
import useProjectState from "../../appstates/project";
import useAppState from "../../appstates/app";
import useModal from "../../modal/modals";

export default function ProjectEdit() {
    const changesCount = useProjectState.use.changes();
    const loadProjectTree = useProjectState.use.loadProjectTree();
    const showModal = useModal.use.showModal();
    const selectedFolder = useProjectState.use.selectedFolder();
    const createNewFolder = useProjectState.use.createNewFolder();
    const createNewFile = useProjectState.use.createNewFile();
    const getParentPath = useProjectState.use.getParentPath();
    const stashCount    = useGitStash.use.stashCount();

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

    function onRefresh() {
        loadProjectTree();
    }

    return (
        <div className="flex items-center justify-between p-2">
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">
                {changesCount} change{changesCount > 1 ? "s" : ""}
            </div>

            <div className='flex flex-end gap-2'>
                <button
                    onClick={() => useAppState.use.setShowGit()(true)}
                    className={`relative w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Git Stash"
                >
                    {stashCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/30 pointer-events-none">
                            {stashCount}
                        </span>
                    )}
                    <i className="fa-solid fa-clock-rotate-left text-xs"></i>
                </button>

                <button
                    onClick={onFile}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="New File"
                >
                    <i className="fas fa-file text-xs"></i>
                </button>

                <button
                    onClick={onFolder}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="New Folder"
                >
                    <i className="fas fa-folder text-xs"></i>
                </button>

                <button
                    onClick={onRefresh}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Refresh"
                >
                    <i className="fas fa-sync-alt text-xs"></i>
                </button>
            </div>

        </div>
    );
}
