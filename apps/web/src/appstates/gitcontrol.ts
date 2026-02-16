import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';

export interface GitHistory {
    hash: string;
    message: string;
    date: string;
}

interface GitBranch {
    name: string;
    isCurrent: boolean;
}

interface gitControlContext {
    loading: boolean;
    history: GitHistory[];
    branch: string;
    branches: GitBranch[];
    commitMessage: string;
    selectedCommit: GitHistory | null;
    commitLoading: boolean;

    setLoading: (loading: boolean) => void;
    setCommitMessage: (message: string) => void;
    setSelectedCommit: (commit: GitHistory | null) => void;
    
    fetchData: () => Promise<void>;
    handleCommit: (e?: React.FormEvent) => Promise<void>;
    handleRevert: () => Promise<void>;

    checkoutBranch: (name: string) => Promise<null | any>;
    createBranch: (name: string) => Promise<void>;
    deleteBranch: (name: string) => Promise<void>;
    mergeBranch: (name: string) => Promise<boolean>;
}

const gitControlContext = create<gitControlContext>()((set, get) => ({
    loading: false,
    history: [],
    branch: "",
    branches: [],
    commitMessage: "",
    selectedCommit: null,
    commitLoading: false,
    
    setLoading: (loading) => set({ loading }),
    setCommitMessage: (message) => set({ commitMessage: message }),
    setSelectedCommit: (commit) => set({ selectedCommit: commit }),

    fetchData: async () => {
        if(config.useDemo) {
            set({ 
                history: [{
                    hash:    "demo-hash",
                    message: "demo-message",
                    date:    "demo-date"
                }], 
                branch: "demo-branch", 
                branches: [{ name: "demo-branch", isCurrent: true }, { name: "demo-dev", isCurrent: false }],
                loading: false 
            });
            return;
        }

        set({ loading: true });
        try {
            const [historyRes, branchRes, branchesRes] = await Promise.all([
                fetch(`${config.serverPath}${apiRoute.gitControl}/history`),
                fetch(`${config.serverPath}${apiRoute.gitControl}/branch`),
                fetch(`${config.serverPath}${apiRoute.gitControl}/branches`)
            ]);

            const historyData = await historyRes.json();
            const branchData = await branchRes.json();
            const branchesData = await branchesRes.json();

            set({
                history: historyData.history || [],
                branch: branchData.branch || "",
                branches: branchesData.branches || []
            });
        } catch (error) {
            console.error("Failed to fetch git data", error);
        } finally {
            set({ loading: false });
        }
    },

    checkoutBranch: async (branchName: string) => {
        if(config.useDemo) return;
        set({ loading: true });
        try {
            const r = await fetch(`${config.serverPath}${apiRoute.gitControl}/branch/checkout`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ branch: branchName })
            });
            const data = await r.json();
            if(data.error){
                set({ loading: false });
                return data.error;
            }
            await get().fetchData();
            set({ loading: false });
            return null;
        } catch (e) {
            set({ loading: false });
            return e;
        } 
    },

    createBranch: async (branchName: string) => {
        if(config.useDemo) return;
        set({ loading: true });
        try {
            await fetch(`${config.serverPath}${apiRoute.gitControl}/branch/create`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ branch: branchName })
            });
            await get().fetchData();
        } catch (e) {
            console.error(e);
            alert("Failed to create branch");
        } finally {
            set({ loading: false });
        }
    },

    deleteBranch: async (branchName: string) => {
        if(config.useDemo) return;
        set({ loading: true });
        
        try {
            await fetch(`${config.serverPath}${apiRoute.gitControl}/branch/delete`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ branch: branchName })
            });
            await get().fetchData();
        } catch (e) {
            console.error(e);
            alert("Failed to delete branch");
        } finally {
            set({ loading: false });
        }
    },

    mergeBranch: async (branchName: string) => {
        if(config.useDemo) return true;

        set({ loading: true });
        try {
            await fetch(`${config.serverPath}${apiRoute.gitControl}/branch/merge`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ branch: branchName })
            });
            await get().fetchData();
            set({ loading: false });
            return true;
        } catch (e) {
            console.error(e);
            alert("Failed to merge branch. " + e);
            set({ loading: false });
            return false;
        }
    },

    handleCommit: async (e?: React.FormEvent) => {
        if(config.useDemo) return;

        if (e) e.preventDefault();
        const { commitMessage } = get();
        if (!commitMessage.trim()) return;

        set({ commitLoading: true });

        try {
            await fetch(`${config.serverPath}${apiRoute.gitControl}/push`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: commitMessage }),
            });
            
            set({ commitMessage: "" });
            set({ loading: true });
            await get().fetchData();

        } catch (error) {
            console.error("Failed to commit and push", error);
            alert("Failed to commit and push");
        } finally {
            set({ commitLoading: false });
            set({ loading: false });
        }
    },

    handleRevert: async () => {
        if(config.useDemo) return;

        const { selectedCommit } = get();
        if (!selectedCommit) return;
        
        set({ loading: true });
        try {
            await fetch(`${config.serverPath}${apiRoute.gitControl}/revert`, {
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
    },
}));

const useGitControlContext = createSelectors(gitControlContext);
export default useGitControlContext;
