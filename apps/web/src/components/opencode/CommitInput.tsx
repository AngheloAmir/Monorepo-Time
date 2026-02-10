import useGitControlContext from "../../appstates/gitcontrol";
import useGitStash from "../../appstates/gitstash";
import useProjectState from "../../appstates/project";

export default function CommitInput() {
    const handleCommit     = useGitControlContext.use.handleCommit();
    const commitMessage    = useGitControlContext.use.commitMessage();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    const commitLoading    = useGitControlContext.use.commitLoading();
    const loadProjectTree  = useProjectState.use.loadProjectTree();
    const setShowStash     = useGitStash.use.setShowStash();
    const stashCount       = useGitStash.use.stashCount();

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                await handleCommit(e);
                await loadProjectTree();
            }}
            className="flex flex-col gap-2"
        >
            <div className="relative flex justify-between">
                <div className="text-sm text-white/40 uppercase font-bold tracking-wider">
                    GIT ADD THEN PUSH
                </div>
                <button
                    id="git-stash-button"
                    type="button"
                    disabled={commitLoading}
                    className={`relative w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Git Stash"
                    onClick={() => setShowStash(true)}
                >
                    { stashCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/30 pointer-events-none">
                            {stashCount}
                        </span>
                    )}
                    <i className="fa-solid fa-clock-rotate-left"></i>
                </button>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={commitLoading || !commitMessage.trim()}
                    className={`w-8 h-8 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Commit & Push"
                >
                    {commitLoading ? <i className="fa-solid fa-spinner fa-spin duration-75" /> : <i className="fa-solid fa-cloud-arrow-up" />}
                </button>
                <input
                    type="text"
                    className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Git commit message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    disabled={commitLoading}
                />
            </div>
        </form>
    );
}