import { useState } from "react";
import useGitControlContext from "../../appstates/gitcontrol";
import useModal from "../../modal/modals";

export default function GitBranches() {
    const commitLoading = useGitControlContext.use.commitLoading();
    const branches = useGitControlContext.use.branches();
    const checkoutBranch = useGitControlContext.use.checkoutBranch();
    const createBranch = useGitControlContext.use.createBranch();
    const deleteBranch = useGitControlContext.use.deleteBranch();
    const mergeBranch = useGitControlContext.use.mergeBranch();
    const showModal = useModal.use.showModal();

    const [newBranchName, setNewBranchName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!newBranchName.trim()) return;
        await createBranch(newBranchName);
        setNewBranchName("");
        setIsCreating(false);
    };

    const handleDelete = async (branchName: string) => {
        if (branchName != 'master')
            showModal(
                "prompt",
                "Delete Branch",
                `Delete this branch ${branchName} pernamently? Enter the branch name to confirm.`,
                "warning",
                (result: any) => {
                    if (result == branchName) {
                        deleteBranch(branchName);
                    }
                }
            )
        else
            showModal(
                "alert",
                "Error",
                "Master branch cannot be deleted!",
                "error",
            )
    };

    const handleMerge = async (branchName: string) => {
        showModal(
            "confirm",
            "Merge Branch",
            "Merge this branch into current branch?",
            "warning",
            (result: any) => {
                if (result) {
                    mergeBranch(branchName);
                }
            }
        )
    };

    const handleCheckout = async (branchName: string) => {
        const r = await checkoutBranch(branchName);
        if (r) {
            showModal(
                "alert",
                "Error",
                r,
                "error",
            )
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="h-12 p-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300">Branches</span>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white`}
                    title="Add Branch"
                >
                    <i className="fas fa-plus text-xs"></i>
                </button>
            </div>

            {isCreating && (
                <div className="p-2 border-b border-white/10 animate-fadeIn">
                    <p className="text-xs text-gray-500 mb-2">
                        Create New Branch and then Checkout
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            placeholder="new branch name"
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <button
                            disabled={commitLoading}
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-2 rounded hover:bg-blue-500"
                        >
                            <i className="fas fa-check text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {branches.map((branch, idx) => (
                    <div
                        key={idx}
                        className={`
                            group flex items-center justify-between p-2 rounded cursor-pointer transition-colors
                            ${branch.isCurrent ? "bg-gradient-to-br from-blue-600/50 to-blue-400/50" : "bg-gradient-to-br hover:from-blue-600/30 hover:to-blue-400/30"}
                        `}
                    >
                        <div
                            className="flex items-center gap-2 flex-1 min-w-0"
                            onClick={() => !branch.isCurrent && handleCheckout(branch.name)}
                            title={branch.isCurrent ? "Current Branch" : "Switch to " + branch.name}
                        >
                            <i className={`fas fa-code-branch text-xs ${branch.isCurrent ? "text-blue-400" : "text-gray-500"}`}></i>
                            <span className={`text-sm truncate ${branch.isCurrent ? "text-blue-100 font-medium" : "text-gray-400 group-hover:text-gray-200"}`}>
                                {branch.name}
                            </span>
                        </div>

                        {!branch.isCurrent && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    disabled={commitLoading}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMerge(branch.name);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-purple-500/20 text-gray-500 hover:text-purple-400"
                                    title="Merge into current"
                                >
                                    <i className="fas fa-code-merge text-[10px]"></i>
                                </button>
                                <button
                                    disabled={commitLoading}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(branch.name);
                                    }}
                                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400"
                                    title="Delete branch"
                                >
                                    <i className="fas fa-trash text-[10px]"></i>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {branches.length === 0 && (
                    <div className="text-gray-600 text-xs text-center py-4">No branches found</div>
                )}
            </div>
        </div>
    );
}
