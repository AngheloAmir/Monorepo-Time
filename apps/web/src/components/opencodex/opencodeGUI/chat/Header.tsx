import type { OpencodeGUIInstance } from "../../../../appstates/opencode";

export default function ChatHeader( {instance, onSaveLogs}: {instance: OpencodeGUIInstance, onSaveLogs?: () => void} ) {
    const apiBase = `http://localhost:${instance.instance.port}`;

    return (
        <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06]">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                onClick={() => {
                    window.open(apiBase, '_blank');
                }}
            >
                Open Opencode Official Web app
            </button>
            
            {onSaveLogs && (
                <button 
                    onClick={onSaveLogs}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-xs text-gray-300 rounded-md border border-gray-800 transition-colors"
                    title="Download Chat Logs"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Save Logs
                </button>
            )}
        </div>
    );
}