import useGitControlContext from "../../../_context/gitcontrol";

export default function GitInput() {
    const branch           = useGitControlContext.use.branch();
    const commitMessage    = useGitControlContext.use.commitMessage();
    const loading          = useGitControlContext.use.loading();
    const handleCommit     = useGitControlContext.use.handleCommit();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    
    return (
        <div className="p-4 bg-[#0A0A0A] border-t border-white/5">
            <div className="flex items-center gap-2 mb-3 px-1">
                <i className="fas fa-code-branch text-xs text-purple-400"></i>
                <span className="text-xs text-gray-400">Current Branch:</span>
                <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    {branch || "..."}
                </span>
            </div>

            <form onSubmit={handleCommit} className="flex gap-2">
                <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Commit message & push..."
                    className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button
                    type="submit"
                    disabled={loading || !commitMessage.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Commit
                </button>
            </form>
        </div>
    );
}