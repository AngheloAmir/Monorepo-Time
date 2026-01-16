import useGitControlContext from "../../../appstates/gitcontrol";

export default function GitInput() {
    const branch           = useGitControlContext.use.branch();
    const commitMessage    = useGitControlContext.use.commitMessage();
    const loading          = useGitControlContext.use.loading();
    const commitLoading    = useGitControlContext.use.commitLoading();
    const handleCommit     = useGitControlContext.use.handleCommit();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    
    return (
        <div className="">
            <div className="flex items-center gap-2 my-1 px-1">
                <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Commiting to branch:
                    <span className="mx-1 text-blue-500">
                        {branch || "..."}
                    </span>
                </span>
            </div>

            <form onSubmit={handleCommit} className="flex gap-2">
                <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    disabled={commitLoading}
                    placeholder="Commit message & push"
                    className="flex-1 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                {
                    commitLoading ? (
                        <button
                            type="button"
                            disabled
                            className="px-4 py-2 hover:bg-white/10 rounded opacity-60 hover:opacity-100 transition-all"
                        >
                            <i className="fas fa-spinner animate-spin text-xl text-blue-500"></i>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading || commitLoading || !commitMessage.trim()}
                            className="px-4 py-2 hover:bg-white/10 rounded opacity-60 hover:opacity-100 transition-all"
                        >
                            <i className="fas fa-paper-plane text-xl text-blue-500 "></i>
                        </button>
                    )
                }
            </form>
        </div>
    );
}