import useGitControlContext from "../../appstates/gitcontrol";
import useProjectState from "../../appstates/project";

export default function CommitInput() {
    const handleCommit = useGitControlContext.use.handleCommit();
    const commitMessage = useGitControlContext.use.commitMessage();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    const commitLoading = useGitControlContext.use.commitLoading();
    const loadProjectTree = useProjectState.use.loadProjectTree();

    return (
        <form
            onSubmit={ async (e) => {
                e.preventDefault();
                await handleCommit(e);
                await loadProjectTree();
            }}
            className="flex flex-col gap-2"
        >
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                GIT ADD THEN PUSH
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Git commit message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    disabled={commitLoading}
                />
                <button
                    type="submit"
                    disabled={commitLoading || !commitMessage.trim()}
                    className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Commit & Push"
                >
                    {commitLoading ? <i className="fa-solid fa-spinner fa-spin duration-75" /> : <i className="fa-solid fa-cloud-arrow-up" />}
                </button>
            </div>
        </form>
    );
}