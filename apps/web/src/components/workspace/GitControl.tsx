import { useState, useEffect } from "react";
import config from "config";
import apiRoute from "apiroute";

interface GitHistory {
    hash: string;
    message: string;
    date: string;
}

export default function GitControl() {
    const [history, setHistory] = useState<GitHistory[]>([]);
    const [branch, setBranch] = useState<string>("");
    const [commitMessage, setCommitMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [selectedCommit, setSelectedCommit] = useState<GitHistory | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [historyRes, branchRes] = await Promise.all([
                fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/history`),
                fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/branch`)
            ]);

            const historyData = await historyRes.json();
            const branchData = await branchRes.json();

            if (historyData.history) setHistory(historyData.history);
            if (branchData.branch) setBranch(branchData.branch);
        } catch (error) {
            console.error("Failed to fetch git data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCommit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commitMessage.trim()) return;

        setLoading(true);
        try {
            await fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/push`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: commitMessage }),
            });
            setCommitMessage("");
            fetchData();
        } catch (error) {
            console.error("Failed to commit and push", error);
            alert("Failed to commit and push");
        } finally {
            setLoading(false);
        }
    };

    const handleRevert = async () => {
        if (!selectedCommit) return;
        setLoading(true);
        try {
            await fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/revert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hash: selectedCommit.hash }),
            });
            setSelectedCommit(null);
            fetchData();
        } catch (error) {
            console.error("Failed to revert", error);
            alert("Failed to revert");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Main Git Control Panel */}
            <div className="w-full h-full p-[1px] rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30">
                <div className="flex flex-col w-full h-full bg-[#09090b] rounded-xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <i className="fab fa-git-alt text-white text-sm"></i>
                            </div>
                            <h2 className="text-white font-bold tracking-tight">Git Control</h2>
                        </div>
                        <button 
                            onClick={fetchData}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all ${loading ? "animate-spin" : ""}`}
                            title="Refresh"
                        >
                            <i className="fas fa-sync-alt text-xs"></i>
                        </button>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {loading && history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                                <i className="fas fa-circle-notch fa-spin"></i>
                                <span className="text-xs">Loading history...</span>
                            </div>
                        ) : (
                            history.map((item) => (
                                <button
                                    key={item.hash}
                                    onClick={() => setSelectedCommit(item)}
                                    className="w-full text-left group flex flex-col gap-1 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm text-gray-200 font-medium line-clamp-1 group-hover:text-white">
                                            {item.message}
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                            {item.hash}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                        <i className="far fa-clock"></i>
                                        <span>{item.date}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer / Controls */}
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
                </div>
            </div>

            {/* Revert Modal */}
            {selectedCommit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden scale-100 animate-scaleIn">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-white text-center mb-2">Revert Changes?</h3>
                            <p className="text-gray-400 text-center text-sm leading-relaxed mb-6">
                                Are you sure you want to revert to commit <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">{selectedCommit.hash}</span>? 
                                <br/>
                                <span className="text-red-400 text-xs mt-2 block">Warning: This will discard all current uncommitted changes.</span>
                            </p>
                            
                            <div className="bg-white/5 rounded-lg p-3 mb-6 border border-white/5">
                                <p className="text-gray-300 text-xs font-mono line-clamp-2">
                                    "{selectedCommit.message}"
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
            )}
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
            `}</style>
        </>
    );
}