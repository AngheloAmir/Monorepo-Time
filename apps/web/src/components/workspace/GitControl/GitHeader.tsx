import useGitControlContext from "../../../appstates/gitcontrol";

export default function GitHeader({ onMinimize }: { onMinimize: () => void }) {
    const loading = useGitControlContext.use.loading();
    const fetchData = useGitControlContext.use.fetchData();

    return (
        <header className="flex items-center justify-between py-1 px-4 ">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMinimize}
                    className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center"
                    title="Minimize Git Control"
                >
                    <i className="fas fa-chevron-right text-xs"></i>
                </button>

                <h2 className="font-bold tracking-tight opacity-80">
                    Git Workflow Helper
                </h2>
            </div>
            <button
                onClick={fetchData}
                className={`w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center text-white  ${loading ? "animate-spin" : ""}`}
                title="Refresh"
            >
                <i className="fas fa-sync-alt text-xs"></i>
            </button>
        </header>
    );
}