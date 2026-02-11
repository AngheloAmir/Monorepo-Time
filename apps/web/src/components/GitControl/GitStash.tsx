import { useState } from "react";
import useGitStash from "../../appstates/gitstash";
import useModal from "../../modal/modals";

export default function GitStash() {
    const showModal = useModal.use.showModal();
    const loadGitStashList = useGitStash.use.loadGitStashList();
    const addGitStash = useGitStash.use.addGitStash();
    const revertGitStash = useGitStash.use.revertGitStash();
    const clearGitStash = useGitStash.use.clearGitStash();
    const stashList = useGitStash.use.stashList();
    const [stashName, setStashName] = useState<string>("");
    const [loading, setLoading] = useState(false);

    async function handleRevertStash(name: string) {
        showModal("confirm",
            `Revert to "${name}"?`,
            "This will stash your current changes and apply the selected stash. Your current work will be saved as a backup.",
            "warning", async (result) => {
                if (!result) return;

                setLoading(true);
                await revertGitStash(name);
                await loadGitStashList();
                setLoading(false);
            }
        );
    }

    async function handleClearStash() {
        showModal("confirm",
            `Clear all stashes?`,
            "This will permanently remove all stash entries. This action cannot be undone.",
            "warning", async (result) => {
                if (!result) return;

                setLoading(true);
                await clearGitStash();
                await loadGitStashList();
                setLoading(false);
            }
        );
    }

    async function handleAddStash() {
        if (!stashName.trim()) return;
        setLoading(true);
        await addGitStash(stashName.trim());
        await loadGitStashList();
        setStashName("");
        setLoading(false);
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-12 p-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300">Git Stash</span>

                {stashList.length > 0 && (
                    <button
                        onClick={handleClearStash}
                        disabled={loading}
                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30"
                        title="Clear all stashes"
                    >
                        <i className="fa-solid fa-trash-can mr-1" />
                        Clear
                    </button>
                )}
            </div>

            {/* Stash List */}
            <div className="flex-1 overflow-y-auto">
                {stashList.length === 0 ? (
                    <div className="px-3 py-5 text-center">
                        <i className="fa-regular fa-folder-open text-white text-lg mb-2 block" />
                        <p className="text-xs text-white">No stash entries</p>
                    </div>
                ) : (
                    <div className="py-1">
                        {stashList.map((stash, index) => (
                            <button
                                key={index}
                                onClick={() => handleRevertStash(stash)}
                                disabled={loading}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/5 transition-colors group disabled:opacity-30"
                            >
                                <i className="fa-solid fa-code-branch text-xs text-blue-400/40 group-hover:text-blue-400 transition-colors" />
                                <span className="flex-1 text-xs text-white transition-colors truncate">
                                    {stash}
                                </span>
                                <i className="fa-solid fa-rotate-left text-xs text-white/0 group-hover:text-white transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Stash Input */}
            <div className="mt-auto flex gap-1 p-2">
                <input
                    type="text"
                    value={stashName}
                    onChange={(e) => setStashName(e.target.value)}
                    disabled={loading}
                    placeholder="Checkpoint name..."
                    className="flex-1 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />

                <button
                    onClick={() => handleAddStash()}
                    className={`w-8 h-8 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Add stash"
                >
                    <i className="fas fa-plus text-xs"></i>
                </button>
            </div>
        </div>
    );
}