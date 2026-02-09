import useProjectState from "../../appstates/project";

export default function ProjectEdit() {
    const changesCount = useProjectState.use.changes();
    const loadProjectTree = useProjectState.use.loadProjectTree();

    return (
        <div className="flex items-center justify-between p-2">
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">
                {changesCount} change{changesCount > 1 ? "s" : ""}
            </div>

            <div className='flex flex-end gap-2'>
                <button
                    onClick={loadProjectTree}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="New File"
                >
                    <i className="fas fa-file text-xs"></i>
                </button>

                <button
                    onClick={loadProjectTree}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="New Folder"
                >
                    <i className="fas fa-folder text-xs"></i>
                </button>

                <button
                    onClick={loadProjectTree}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Refresh"
                >
                    <i className="fas fa-sync-alt text-xs"></i>
                </button>
            </div>

        </div>
    );
}