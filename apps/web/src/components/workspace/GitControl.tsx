import { useState, useEffect } from "react";
import config from "config";
import apiRoute from "apiroute";
import GitHistory from "./GitControl/GitHistory";
import GitHeader from "./GitControl/GitHeader";
import GitInput from "./GitControl/GitInput";
import RevertModal from "./GitControl/RevertModal";

export interface GitHistory {
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
            <div className="w-full h-full p-[1px] rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30">
                <div className="flex flex-col w-full h-full bg-[#09090b] rounded-xl overflow-hidden">
                    <GitHeader
                        loading={loading}
                        fetchData={fetchData}
                    />
                    <GitHistory
                        isLoading={loading}
                        history={history}
                        setSelectedCommit={setSelectedCommit}
                    />
                    <GitInput
                        branch={branch}
                        commitMessage={commitMessage}
                        loading={loading}
                        handleCommit={handleCommit}
                        setCommitMessage={setCommitMessage}
                    />
                </div>
            </div>

            { selectedCommit && 
                <RevertModal
                    selectedCommit={selectedCommit}
                    setSelectedCommit={setSelectedCommit}
                    handleRevert={handleRevert}
                />
            }
            
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