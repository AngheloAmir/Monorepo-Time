import type { GitHistory } from "../GitControl";

interface GitHistoryProps {
    isLoading: boolean;
    history: GitHistory[];
    setSelectedCommit: (commit: GitHistory) => void;
}

export default function GitHistory( props :GitHistoryProps ) {
    const { isLoading, history, setSelectedCommit } = props;

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span className="text-xs">Loading history...</span>
                </div>
            ) : (
                history.map((item) => (
                    <button
                        key={item.hash}
                        onClick={() => setSelectedCommit(item)}
                        className="w-full text-left group flex flex-col gap-1 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-gray-200 font-medium line-clamp-1 group-hover:text-white">
                                {item.message}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
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