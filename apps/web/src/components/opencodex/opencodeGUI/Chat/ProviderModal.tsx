
import useOpencodeChat from '../../../../appstates/opencodeChat';

interface ProviderModalProps {
    apiBase: string;
}

// ── Well-known provider metadata ─────────────────────────────────────
const PROVIDER_META: Record<string, { icon: string; description: string }> = {
    opencode:    { icon: '≡',  description: 'OpenCode Zen built-in provider' },
    anthropic:   { icon: 'A',  description: 'Direct access to Claude models, including Pro and Max' },
    copilot:     { icon: '⊛',  description: 'Claude models for coding assistance' },
    openai:      { icon: '◎',  description: 'GPT models for fast, capable general AI tasks' },
    google:      { icon: '◆',  description: 'Gemini models for fast, structured responses' },
    openrouter:  { icon: '⇌',  description: 'Access all supported models from one provider' },
    vercel:      { icon: '▲',  description: 'Vercel AI Gateway for seamless model access' },
    groq:        { icon: '⚡',  description: 'Ultra-fast inference for open-source models' },
    fireworks:   { icon: '✦',  description: 'Fast inference for popular open-source models' },
    together:    { icon: '⊞',  description: 'Run open-source models with Together AI' },
    deepseek:    { icon: '◉',  description: 'DeepSeek models for code and reasoning' },
    mistral:     { icon: 'M',  description: 'Mistral models for efficient AI tasks' },
    xai:         { icon: '𝕏',  description: 'xAI Grok models for conversational AI' },
    aws:         { icon: '⬡',  description: 'AWS Bedrock models for enterprise AI' },
    azure:       { icon: '◇',  description: 'Azure OpenAI for enterprise deployments' },
};

function getProviderMeta(id: string) {
    return PROVIDER_META[id] || { icon: '●', description: '' };
}


export default function ProviderModal({ apiBase }: ProviderModalProps) {
    const showProviderModal   = useOpencodeChat.use.showProviderModal();
    const providers           = useOpencodeChat.use.providers();
    const currentProvider     = useOpencodeChat.use.currentProvider();
    const selectedProviderForAuth = useOpencodeChat.use.selectedProviderForAuth();
    const providerApiKey      = useOpencodeChat.use.providerApiKey();

    const setShowProviderModal      = useOpencodeChat.use.setShowProviderModal();
    const setSelectedProviderForAuth = useOpencodeChat.use.setSelectedProviderForAuth();
    const setProviderApiKey         = useOpencodeChat.use.setProviderApiKey();
    const connectProvider           = useOpencodeChat.use.connectProvider();
    const setActiveProvider         = useOpencodeChat.use.setActiveProvider();
    const fetchProviders            = useOpencodeChat.use.fetchProviders();

    if (!showProviderModal) return null;

    // Split into connected / not-connected
    const connectedProviders = providers.filter((p) => p.connected);
    const popularProviders   = providers.filter((p) => !p.connected);

    const isZenProvider = (id: string) => id === 'opencode';


    const handleConnect = (providerId: string) => {
        if (isZenProvider(providerId)) {
            // OpenCode Zen — show API key input
            setSelectedProviderForAuth(providerId);
        } else {
            // Other providers — open the real OpenCode web instance
            window.open(apiBase, '_blank');
        }
    };

    const handleDisconnect = async (providerId: string) => {
        // Remove API key / disconnect
        try {
            await fetch(`${apiBase}/auth/${providerId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            fetchProviders(apiBase);
        } catch (err) {
            console.error('Failed to disconnect provider:', err);
        }
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
                    className="relative w-full max-w-lg bg-[#111111] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.08]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-white/[0.06]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Providers</h3>
                            <button
                                onClick={() => setShowProviderModal(false)}
                                className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <div className="max-h-[480px] overflow-y-auto">
                        {/* ── Connected providers ─────────────────────── */}
                        {connectedProviders.length > 0 && (
                            <div className="px-6 pt-5 pb-4">
                                <h4 className="text-xs font-medium text-gray-400 mb-3">Connected providers</h4>
                                <div className="space-y-2">
                                    {connectedProviders.map((p) => {
                                        const meta = getProviderMeta(p.id);
                                        return (
                                            <div
                                                key={p.id}
                                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                                                    currentProvider === p.id
                                                        ? 'bg-white/[0.04] border-white/[0.12]'
                                                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <ProviderIcon icon={meta.icon} />
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-sm font-medium text-white">{p.name}</span>
                                                        {p.env && p.env.length > 0 && (
                                                            <span className="px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-white/[0.05] border border-white/[0.08] rounded-md">
                                                                API key
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {currentProvider !== p.id && (
                                                        <button
                                                            onClick={() => setActiveProvider(p.id)}
                                                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
                                                        >
                                                            Use
                                                        </button>
                                                    )}
                                                    {currentProvider === p.id && (
                                                        <span className="px-2 py-0.5 text-[10px] text-blue-400 font-medium">Active</span>
                                                    )}
                                                    <button
                                                        onClick={() => handleDisconnect(p.id)}
                                                        className="text-xs text-gray-500 hover:text-red-400 transition-colors ml-1"
                                                    >
                                                        Disconnect
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Popular providers ──────────────────────── */}
                        <div className={`px-6 ${connectedProviders.length > 0 ? 'pt-2' : 'pt-5'} pb-5`}>
                            <h4 className="text-xs font-medium text-gray-400 mb-3">
                                {connectedProviders.length > 0 ? 'Popular providers' : 'Available providers'}
                            </h4>
                            {popularProviders.length === 0 && connectedProviders.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-500">No providers available</p>
                                    <p className="text-xs text-gray-600 mt-1">Start the OpenCode server to see providers</p>
                                </div>
                            ) : popularProviders.length === 0 ? (
                                <p className="text-xs text-gray-600 py-3">All providers are connected</p>
                            ) : (
                                <div className="rounded-xl border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
                                    {popularProviders.map((p) => {
                                        const meta = getProviderMeta(p.id);
                                        return (
                                            <div
                                                key={p.id}
                                                className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <ProviderIcon icon={meta.icon} />
                                                    <div>
                                                        <div className="text-sm text-white">{p.name}</div>
                                                        {meta.description && (
                                                            <div className="text-[11px] text-gray-500 mt-0.5 max-w-[260px]">{meta.description}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleConnect(p.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/[0.08] transition-colors shrink-0"
                                                >
                                                    <span className="text-[10px]">+</span>
                                                    <span>Connect</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Hint for non-zen providers */}
                        {popularProviders.some((p) => !isZenProvider(p.id)) && (
                            <div className="px-6 pb-5">
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    <i className="fas fa-info-circle text-[9px] mr-1.5 opacity-50"></i>
                                    Non-Zen providers will open the OpenCode web app where you can configure your API keys. Changes are synced automatically.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* API key input (only for OpenCode Zen) */}
                    {selectedProviderForAuth && isZenProvider(selectedProviderForAuth) && (
                        <div className="px-6 py-4 border-t border-white/[0.06]">
                            <label className="block text-xs text-gray-400 font-medium mb-2">
                                OpenCode Zen API Key
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={providerApiKey}
                                    onChange={(e) => setProviderApiKey(e.target.value)}
                                    placeholder="sk-..."
                                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && connectProvider(apiBase)}
                                    autoFocus
                                />
                                <button
                                    onClick={() => connectProvider(apiBase)}
                                    disabled={!providerApiKey}
                                    className="px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm text-white font-medium transition-colors"
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


// ── Provider Icon ────────────────────────────────────────────────────
function ProviderIcon({ icon }: { icon: string }) {
    return (
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-sm text-gray-300 shrink-0 font-medium select-none">
            {icon}
        </div>
    );
}
