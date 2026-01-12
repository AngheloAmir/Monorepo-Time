import useGitControlContext from "../../../_context/gitcontrol";

export default function RevertModal() {
    const selectedCommit    = useGitControlContext.use.selectedCommit();
    const setSelectedCommit = useGitControlContext.use.setSelectedCommit();
    const handleRevert      = useGitControlContext.use.handleRevert();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden scale-100 animate-scaleIn">
                <div className="p-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-2">Revert Changes?</h3>
                    <p className="text-gray-400 text-center text-sm leading-relaxed mb-6">
                        Are you sure you want to revert to commit <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">{selectedCommit?.hash}</span>?
                        <br />
                        <span className="text-red-400 text-xs mt-2 block">Warning: This will discard all current uncommitted changes.</span>
                    </p>

                    <div className="bg-white/5 rounded-lg p-3 mb-6 border border-white/5">
                        <p className="text-gray-300 text-xs font-mono line-clamp-2">
                            "{selectedCommit?.message}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSelectedCommit(null)}
                            className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRevert}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-500 shadow-lg shadow-red-500/20 transition-all"
                        >
                            Confirm Revert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}