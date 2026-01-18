import useWorkspaceState from "../../appstates/workspace"

export default function Loading() {
    const workspaceLoading = useWorkspaceState.use.workspaceLoading();
    const loadMessage      = useWorkspaceState.use.loadMessage();

    if(!workspaceLoading) return null;
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <i className="opacity-50 fas fa-spinner animate-spin text-4xl text-blue-500" />
            <p className="text-white text-lg font-bold">{loadMessage}</p>
        </div>
    )
}
