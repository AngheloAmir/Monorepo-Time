import { useState } from "react";
import useGitControlContext from "../../appstates/gitcontrol";

export default function GitBranches() {
    const branches = useGitControlContext.use.branches();
    const checkoutBranch = useGitControlContext.use.checkoutBranch();
    const createBranch = useGitControlContext.use.createBranch();
    const deleteBranch = useGitControlContext.use.deleteBranch();
    const mergeBranch = useGitControlContext.use.mergeBranch();

    const [newBranchName, setNewBranchName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!newBranchName.trim()) return;
        await createBranch(newBranchName);
        setNewBranchName("");
        setIsCreating(false);
    };

    return (
        <div className="flex flex-col h-full border-r border-white/10 bg-black/20 w-[250px]">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300">Branches</span>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded transition-colors"
                >
                    <i className="fas fa-plus"></i>
                </button>
            </div>

            {isCreating && (
                <div className="p-2 border-b border-white/10 animate-fadeIn">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            placeholder="Branch name..."
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            autoFocus
                        />
                        <button 
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
                            ${branch.isCurrent ? "bg-blue-600/20 border border-blue-500/30" : "hover:bg-white/5 border border-transparent"}
                        `}
                    >
                        <div 
                            className="flex items-center gap-2 flex-1 min-w-0"
                            onClick={() => !branch.isCurrent && checkoutBranch(branch.name)}
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
                                    onClick={(e) => { e.stopPropagation(); mergeBranch(branch.name); }}
                                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-purple-500/20 text-gray-500 hover:text-purple-400"
                                    title="Merge into current"
                                >
                                    <i className="fas fa-code-merge text-[10px]"></i>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteBranch(branch.name); }}
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
