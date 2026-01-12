import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config   from 'config';

export interface GitHistory {
    hash: string;
    message: string;
    date: string;
}

interface gitControlContext {
    loading: boolean;
    history: GitHistory[];
    branch: string;
    commitMessage: string;
    selectedCommit: GitHistory | null;

    setLoading: (loading: boolean) => void;
    setCommitMessage: (message: string) => void;
    setSelectedCommit: (commit: GitHistory | null) => void;
    
    fetchData: () => Promise<void>;
    handleCommit: (e?: React.FormEvent) => Promise<void>;
    handleRevert: () => Promise<void>;
}

const gitControlContext = create<gitControlContext>()((set, get) => ({
    loading: false,
    history: [],
    branch: "",
    commitMessage: "",
    selectedCommit: null,

    setLoading: (loading) => set({ loading }),
    setCommitMessage: (message) => set({ commitMessage: message }),
    setSelectedCommit: (commit) => set({ selectedCommit: commit }),

    fetchData: async () => {
        set({ loading: true });
        try {
            const [historyRes, branchRes] = await Promise.all([
                fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/history`),
                fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/branch`)
            ]);

            const historyData = await historyRes.json();
            const branchData = await branchRes.json();

            set({
                history: historyData.history || [],
                branch: branchData.branch || ""
            });
        } catch (error) {
            console.error("Failed to fetch git data", error);
        } finally {
            set({ loading: false });
        }
    },

    handleCommit: async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const { commitMessage } = get();
        if (!commitMessage.trim()) return;

        set({ loading: true });
        try {
            await fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/push`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: commitMessage }),
            });
            set({ commitMessage: "" });
            await get().fetchData();
        } catch (error) {
            console.error("Failed to commit and push", error);
            alert("Failed to commit and push");
        } finally {
            set({ loading: false });
        }
    },

    handleRevert: async () => {
        const { selectedCommit } = get();
        if (!selectedCommit) return;
        
        set({ loading: true });
        try {
            await fetch(`http://localhost:${config.apiPort}/${apiRoute.gitControl}/revert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hash: selectedCommit.hash }),
            });
            set({ selectedCommit: null });
            await get().fetchData();
        } catch (error) {
            console.error("Failed to revert", error);
            alert("Failed to revert");
        } finally {
            set({ loading: false });
        }
    }
}));

const useGitControlContext = createSelectors(gitControlContext);
export default useGitControlContext;
