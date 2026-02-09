import useProjectState from "../../appstates/project";
import useModal from "../../modal/modals";

export default function ProjectEdit() {
    const changesCount      = useProjectState.use.changes();
    const loadProjectTree   = useProjectState.use.loadProjectTree();
    const showModal         = useModal.use.showModal();
    const selectedFolder    = useProjectState.use.selectedFolder();
    const createNew         = useProjectState.use.createNew();
    const getParentPath     = useProjectState.use.getParentPath();


    async function onFileOrFolder() {
        showModal("prompt", "New File or Folder", `Include the extension if you want to create a file, otherwise it will be a folder. At ${selectedFolder}`, "success", async (newName: any) => {
            if (newName) {
                const parentPath = getParentPath();
                const fullPath   = `${parentPath}/${newName}`;
                await createNew(fullPath);
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
                    onClick={onFileOrFolder}
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