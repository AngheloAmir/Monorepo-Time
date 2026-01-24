import useWorkspaceState from "../../appstates/workspace"

export default function Loading() {
    const workspaceLoading = useWorkspaceState.use.workspaceLoading();
    const loadMessage      = useWorkspaceState.use.loadMessage();

    if(!workspaceLoading) return null;
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="flex flex-col items-center">
                <i className="fas fa-spinner animate-spin text-4xl text-blue-500" />
                <p className="text-white text-lg font-bold">{loadMessage}</p>

                <button className="mt-2 text-white text-md w-24 font-bold bg-red-500 p-2 rounded hover:bg-red-600"
                    onClick={() => {
                        window.isLoadingCancelled = true;
                    }}>
                        Cancel
                </button>
            </div>
        </div>
    )
}
