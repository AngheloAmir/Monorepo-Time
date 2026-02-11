import { useEffect, useRef } from "react";
import useGitControlContext from "../../appstates/gitcontrol";
import useAppState from "../../appstates/app";

export default function GitInput() {
    const commitMessage    = useGitControlContext.use.commitMessage();
    const loading          = useGitControlContext.use.loading();
    const commitLoading    = useGitControlContext.use.commitLoading();
    const handleCommit     = useGitControlContext.use.handleCommit();
    const setCommitMessage = useGitControlContext.use.setCommitMessage();
    const setShowGit       = useAppState.use.setShowGit();
    const ref              = useRef<HTMLInputElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <div className="">
            <form onSubmit={async (e) => {
                await handleCommit(e);
                setShowGit(false);
            }} className="flex gap-2">
                <input
                    ref={ref}
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