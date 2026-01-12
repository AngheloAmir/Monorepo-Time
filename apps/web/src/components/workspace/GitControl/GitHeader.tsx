interface GitHeaderProps {
    loading: boolean;
    fetchData: () => void;
}

export default function GitHeader(props: GitHeaderProps) {
    const { loading, fetchData } = props;
    return (
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <i className="fab fa-git-alt text-white text-sm"></i>
                </div>
                <h2 className="text-white font-bold tracking-tight">Git Control</h2>
            </div>
            <button
                onClick={fetchData}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all ${loading ? "animate-spin" : ""}`}
                title="Refresh"
            >
                <i className="fas fa-sync-alt text-xs"></i>
            </button>
        </header>
    );
}