import useOpencodeChat from '../../../../appstates/opencodeChat';

interface ProviderModalProps {
    apiBase: string;
}

export default function ProviderModal({ apiBase }: ProviderModalProps) {
    const showProviderModal   = useOpencodeChat.use.showProviderModal();
    const providers           = useOpencodeChat.use.providers();
    const models              = useOpencodeChat.use.models();
    const currentProvider     = useOpencodeChat.use.currentProvider();
    const selectedProviderForAuth = useOpencodeChat.use.selectedProviderForAuth();
    const providerApiKey      = useOpencodeChat.use.providerApiKey();

    const setShowProviderModal      = useOpencodeChat.use.setShowProviderModal();
    const setSelectedProviderForAuth = useOpencodeChat.use.setSelectedProviderForAuth();
    const setProviderApiKey         = useOpencodeChat.use.setProviderApiKey();
    const connectProvider           = useOpencodeChat.use.connectProvider();
    const setActiveProvider         = useOpencodeChat.use.setActiveProvider();

    if (!showProviderModal) return null;

    const getProviderModelCount = (providerId: string) => {
        const provider = providers.find((p) => p.id === providerId);
        if (provider?.models) return provider.models.length;
        return models.filter((m) => m.provider === providerId).length;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setShowProviderModal(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-md bg-[#111111] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.08]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Choose Provider</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Select and configure AI providers</p>
                            </div>
                            <button
                                onClick={() => setShowProviderModal(false)}
                                className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                        </div>
                    </div>

                    {/* Provider list */}
                    <div className="max-h-[340px] overflow-y-auto">
                        {providers.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <p className="text-sm text-gray-500">No providers available</p>
                                <p className="text-xs text-gray-600 mt-1">Start the OpenCode server to see providers</p>
                            </div>
                        ) : (
                            <div className="py-1">
                                {providers.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`flex items-center justify-between px-5 py-3 transition-colors cursor-pointer ${
                                            currentProvider === p.id
                                                ? 'bg-white/[0.04]'
                                                : 'hover:bg-white/[0.02]'
                                        }`}
                                        onClick={() => {
                                            if (p.connected) setActiveProvider(p.id);
                                            else setSelectedProviderForAuth(p.id);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${p.connected ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                                            <div>
                                                <div className="text-sm text-gray-200">{p.name}</div>
                                                <div className="text-[10px] text-gray-600">
                                                    {getProviderModelCount(p.id)} model{getProviderModelCount(p.id) !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {currentProvider === p.id && (
                                                <span className="text-[10px] text-blue-400 font-medium">Active</span>
                                            )}
                                            {!p.connected && (
                                                <span className="text-[10px] text-gray-600">Not connected</span>
                                            )}
                                            <i className="fas fa-chevron-right text-[8px] text-gray-700"></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* API key input */}
                    {selectedProviderForAuth && (
                        <div className="px-5 py-3 border-t border-white/[0.06]">
                            <label className="block text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">
                                API Key — {providers.find((p) => p.id === selectedProviderForAuth)?.name}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={providerApiKey}
                                    onChange={(e) => setProviderApiKey(e.target.value)}
                                    placeholder="sk-..."
                                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && connectProvider(apiBase)}
                                    autoFocus
                                />
                                <button
                                    onClick={() => connectProvider(apiBase)}
                                    disabled={!providerApiKey}
                                    className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm text-white transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
