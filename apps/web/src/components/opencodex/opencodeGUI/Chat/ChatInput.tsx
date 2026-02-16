import { useState, useRef, useEffect } from 'react';
import useOpencodeChat from '../../../../appstates/opencodeChat';

interface ChatInputProps {
    instanceId: string;
    apiBase:    string;
}

export default function ChatInput({ instanceId, apiBase }: ChatInputProps) {
    const isLoading       = useOpencodeChat.use.isLoading();
    const sendMessage     = useOpencodeChat.use.sendMessage();
    const agents          = useOpencodeChat.use.agents();
    const models          = useOpencodeChat.use.models();

    const selectedModel   = useOpencodeChat.use.selectedModel();
    const selectedAgent   = useOpencodeChat.use.selectedAgent();
    const currentProvider = useOpencodeChat.use.currentProvider();
    const reasoningEffort = useOpencodeChat.use.reasoningEffort();

    const setSelectedModel   = useOpencodeChat.use.setSelectedModel();
    const setSelectedAgent   = useOpencodeChat.use.setSelectedAgent();
    const setReasoningEffort = useOpencodeChat.use.setReasoningEffort();

    const [input, setInput] = useState('');
    const textareaRef       = useRef<HTMLTextAreaElement>(null);

    const availableModels = currentProvider
        ? models.filter((m) => m.provider === currentProvider)
        : models;

    // Get display name for the selected model
    const selectedModelName = (() => {
        if (!selectedModel) return 'Default';
        const model = models.find((m) => m.id === selectedModel);
        return model?.name || selectedModel.split('/').pop() || 'Default';
    })();

    // Get display name for selected agent
    const selectedAgentName = (() => {
        const agent = agents.find((a) => a.id === selectedAgent);
        return agent?.name || selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1);
    })();

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = 'auto';
            ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(instanceId, apiBase, input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="shrink-0 px-4 sm:px-8 md:px-16 lg:px-24 pb-4 pt-2">
            {/* Input container — mimics official OpenCode */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#111111] overflow-hidden focus-within:border-white/[0.15] transition-colors">
                {/* Textarea */}
                <div className="px-4 pt-3 pb-1">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Ask anything... "Convert this to TypeScript"'
                        className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed min-h-[24px] max-h-[200px]"
                        rows={1}
                        disabled={isLoading}
                    />
                </div>

                {/* Bottom bar — selectors + send button */}
                <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-1">
                        {/* Agent selector */}
                        <InlineSelect
                            value={selectedAgent}
                            onChange={setSelectedAgent}
                            displayLabel={selectedAgentName}
                            options={[
                                ...(agents.map((a) => ({ value: a.id, label: a.name }))),
                                ...(!agents.find(a => a.id === 'build') ? [{ value: 'build', label: 'Build' }] : []),
                                ...(!agents.find(a => a.id === 'plan')  ? [{ value: 'plan',  label: 'Plan' }]  : []),
                            ]}
                            icon="fa-hammer"
                        />

                        {/* Divider */}
                        <div className="w-px h-4 bg-white/[0.06] mx-0.5"></div>

                        {/* Model selector */}
                        <InlineSelect
                            value={selectedModel}
                            onChange={setSelectedModel}
                            displayLabel={selectedModelName}
                            options={[
                                { value: '', label: 'Default' },
                                ...availableModels.map((m) => ({ value: m.id, label: m.name })),
                            ]}
                            icon="fa-microchip"
                        />

                        {/* Divider */}
                        <div className="w-px h-4 bg-white/[0.06] mx-0.5"></div>

                        {/* Reasoning level */}
                        <InlineSelect
                            value={reasoningEffort}
                            onChange={setReasoningEffort}
                            displayLabel={reasoningEffort.charAt(0).toUpperCase() + reasoningEffort.slice(1)}
                            options={[
                                { value: 'low',    label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high',   label: 'High' },
                                { value: 'xhigh',  label: 'Extra High' },
                            ]}
                        />
                    </div>

                    {/* Send button */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="w-7 h-7 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white flex items-center justify-center transition-all duration-150 text-xs"
                        >
                            {isLoading ? (
                                <i className="fas fa-spinner fa-spin text-[10px]"></i>
                            ) : (
                                <i className="fas fa-arrow-up text-[10px]"></i>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ── Inline Select ────────────────────────────────────────────────────
// A minimal dropdown that looks like a text button (matches OpenCode CLI style)
function InlineSelect({
    value,
    onChange,
    displayLabel,
    options,
    icon,
}: {
    value:        string;
    onChange:     (value: string) => void;
    displayLabel: string;
    options:      { value: string; label: string }[];
    icon?:        string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] transition-all duration-150 select-none"
            >
                {icon && <i className={`fas ${icon} text-[9px] opacity-50`}></i>}
                <span className="max-w-[120px] truncate">{displayLabel}</span>
                <i className={`fas fa-chevron-down text-[7px] opacity-40 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-1 min-w-[160px] max-h-[240px] overflow-y-auto bg-[#151515] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 z-50 py-1">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                                value === opt.value
                                    ? 'text-white bg-white/[0.06]'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
