import useGitControlContext from "../../appstates/gitcontrol";

export default function GitHistory() {
    const isLoading         = useGitControlContext.use.loading();
    const history           = useGitControlContext.use.history();
    const commitLoading     = useGitControlContext.use.commitLoading();
    const setSelectedCommit = useGitControlContext.use.setSelectedCommit();

    return (
        <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span className="text-xs">Loading history...</span>
                </div>
            ) : (
                history.map((item) => (
                    <button
                        disabled={commitLoading}
                        key={item.hash}
                        onClick={() => setSelectedCommit(item)}
                        className={`
                            w-full text-left group flex flex-col gap-1 p-2
                            rounded 
                            bg-gradient-to-r hover:from-blue-500/50 hover:to-blue-300/50
                            transition-all duration-200
                        `}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-white font-medium ">
                                {item.message}
                            </span>
                            <span className="text-[12px] font-mono text-white px-1.5 py-0.5 border border-white/7">
                                {item.hash}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <i className="far fa-clock"></i>
                            <span>{item.date}</span>
                        </div>
                    </button>
                ))
            )}
        </div>
    )
}