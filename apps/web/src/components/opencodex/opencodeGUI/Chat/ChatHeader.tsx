import useOpencodeChat from '../../../../appstates/opencodeChat';

interface ChatHeaderProps {
    instanceId: string;
    apiBase:    string;
}

export default function ChatHeader({ instanceId, apiBase }: ChatHeaderProps) {
    const currentProvider     = useOpencodeChat.use.currentProvider();
    const providers           = useOpencodeChat.use.providers();
    const setShowProviderModal = useOpencodeChat.use.setShowProviderModal();

    const currentProviderName = providers.find((p) => p.id === currentProvider)?.name || '';
    const connectedCount      = providers.filter((p) => p.connected).length;

    return (
        <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06]">
            {/* Left — just a subtle status */}
            <div className="flex items-center gap-2">
                {currentProvider && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        <span>{currentProviderName}</span>
                    </div>
                )}
            </div>

            {/* Right — Choose Provider button */}
            <button
                onClick={() => setShowProviderModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] transition-all duration-150"
            >
                <i className="fas fa-key text-[10px]"></i>
                <span>Choose Provider</span>
                {connectedCount > 0 && (
                    <span className="text-[10px] text-gray-600">({connectedCount})</span>
                )}
            </button>
        </div>
    );
}
