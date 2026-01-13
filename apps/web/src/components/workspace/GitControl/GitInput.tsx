import useGitControlContext from "../../../_context/gitcontrol";

export default function GitInput() {
    const branch           = useGitControlContext.use.branch();
    const commitMessage    = useGitControlContext.use.commitMessage();
    const loading          = useGitControlContext.use.loading();
    const handleCommit     = useGitControlContext.use.handleCommit();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    
    return (
        <div className="">
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
                    className="flex-1 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button
                    type="submit"
                    disabled={loading || !commitMessage.trim()}
                    className="px-4 py-2 hover:bg-white/10 rounded opacity-60 hover:opacity-100 transition-all"
                >
                    <i className="fas fa-paper-plane text-xl text-blue-500 "></i>
                </button>
            </form>
        </div>
    );
}