import { useEffect } from "react";
import useGitControlContext from "../../_context/gitcontrol";
import GitHistory from "./GitControl/GitHistory";
import GitHeader from "./GitControl/GitHeader";
import GitInput from "./GitControl/GitInput";
import RevertModal from "./GitControl/RevertModal";

export default function GitControl() {
    const fetchData      = useGitControlContext.use.fetchData();
    const selectedCommit = useGitControlContext.use.selectedCommit();

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="w-full h-full">
                <div className="flex flex-col w-full h-full overflow-hidden">
                    <GitHeader />
                    <GitHistory />
                    <GitInput />
                </div>
            </div>

            { selectedCommit && 
                <RevertModal />
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