import { useEffect, useRef } from 'react';
import useOpencodeChat       from '../../../../appstates/opencodeChat';
import type { ChatMessage }  from '../../../../appstates/opencodeChat';

interface ChatMessagesProps {
    instanceId: string;
    apiBase:    string;
}

export default function ChatMessages({ instanceId }: ChatMessagesProps) {
    const instanceMessages = useOpencodeChat.use.instanceMessages();
    const isLoading        = useOpencodeChat.use.isLoading();
    const messagesEndRef   = useRef<HTMLDivElement>(null);
    const messages         = instanceMessages[instanceId] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // ── Empty State ──────────────────────────────────────────────────
    if (messages.length === 0 && !isLoading) {
        return (
            <div className="flex-1 overflow-y-auto flex items-center justify-center">
                <EmptyState />
            </div>
        );
    }

    // ── Messages ─────────────────────────────────────────────────────
    return (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-24 py-6 space-y-6">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && <LoadingIndicator />}

            <div ref={messagesEndRef} />
        </div>
    );
}


// ── Empty State ──────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="text-center px-6 max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-200 mb-3">
                Start a conversation
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Ask OpenCode to help you write, debug, refactor, or explain code.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                {[
                    'Explain this code',
                    'Fix the bug',
                    'Write a test',
                    'Refactor',
                ].map((suggestion) => (
                    <span
                        key={suggestion}
                        className="px-4 py-2 text-sm rounded-xl bg-white/[0.04] text-gray-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-gray-300 hover:border-white/[0.1] transition-all duration-150 cursor-pointer select-none"
                    >
                        {suggestion}
                    </span>
                ))}
            </div>
        </div>
    );
}


// ── Loading Indicator ────────────────────────────────────────────────
function LoadingIndicator() {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <i className="fas fa-robot text-gray-500 text-[10px]"></i>
            </div>
            <div className="pt-1">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '400ms' }}></span>
                </div>
            </div>
        </div>
    );
}


// ── Message Bubble ───────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
    if (message.role === 'user')  return <UserBubble message={message} />;
    if (message.role === 'error') return <ErrorBubble message={message} />;
    if (message.role === 'event') return <EventBubble message={message} />;
    return <AssistantBubble message={message} />;
}


// ── User Bubble ──────────────────────────────────────────────────────
function UserBubble({ message }: { message: ChatMessage }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fas fa-user text-blue-400 text-[10px]"></i>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
        </div>
    );
}


// ── Assistant Bubble ─────────────────────────────────────────────────
function AssistantBubble({ message }: { message: ChatMessage }) {
    const hasParts = message.parts && message.parts.length > 0;

    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <i className="fas fa-robot text-gray-400 text-[10px]"></i>
            </div>
            <div className="flex-1 min-w-0 space-y-3">
                {hasParts ? (
                    message.parts!.map((part, index) => (
                        <PartRenderer key={index} part={part} />
                    ))
                ) : (
                    <div className="pt-0.5">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                )}

                {/* Metadata */}
                {message.metadata && (
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        {message.metadata.modelID && (
                            <span className="font-mono">{message.metadata.modelID.split('/').pop()}</span>
                        )}
                        {message.metadata.tokens && (
                            <>
                                <span className="opacity-30">·</span>
                                <span>{(message.metadata.tokens.input + message.metadata.tokens.output).toLocaleString()} tokens</span>
                            </>
                        )}
                        {message.metadata.cost !== undefined && message.metadata.cost > 0 && (
                            <>
                                <span className="opacity-30">·</span>
                                <span>${message.metadata.cost.toFixed(4)}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


// ── Part Renderer ────────────────────────────────────────────────────
function PartRenderer({ part }: { part: NonNullable<ChatMessage['parts']>[number] }) {
    switch (part.type) {
        case 'thinking':
            return (
                <details className="group">
                    <summary className="flex items-center gap-2 py-1 cursor-pointer text-xs text-gray-500 hover:text-gray-400 transition-colors select-none">
                        <i className="fas fa-chevron-right text-[8px] transition-transform duration-150 group-open:rotate-90"></i>
                        <i className="fas fa-brain text-[10px] opacity-60"></i>
                        <span>Thinking</span>
                    </summary>
                    <div className="ml-4 mt-1 pl-3 border-l-2 border-white/[0.06] text-xs text-gray-500 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
                        {part.text}
                    </div>
                </details>
            );

        case 'tool':
            return <ToolCallRenderer part={part} />;

        case 'step-start':
            return (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <i className="fas fa-play text-[7px] text-blue-400/40"></i>
                    <span>{part.text || 'Processing...'}</span>
                </div>
            );

        case 'step-finish':
            return (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <i className="fas fa-check text-[7px] text-green-400/40"></i>
                    <span>{part.text || 'Done'}</span>
                </div>
            );

        case 'text':
        default:
            if (!part.text) return null;
            return (
                <div className="pt-0.5">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{part.text}</p>
                </div>
            );
    }
}


// ── Tool Call Renderer ───────────────────────────────────────────────
function ToolCallRenderer({ part }: { part: NonNullable<ChatMessage['parts']>[number] }) {
    const status = part.state?.status || 'pending';

    const statusIcon = {
        pending:   'fa-clock',
        running:   'fa-spinner fa-spin',
        completed: 'fa-check',
        error:     'fa-times',
    }[status];

    const statusColor = {
        pending:   'text-gray-500',
        running:   'text-blue-400',
        completed: 'text-green-400',
        error:     'text-red-400',
    }[status];

    return (
        <details className="group">
            <summary className="flex items-center gap-2 py-1 cursor-pointer text-xs hover:bg-white/[0.02] rounded transition-colors select-none">
                <i className="fas fa-chevron-right text-[8px] text-gray-600 transition-transform duration-150 group-open:rotate-90"></i>
                <i className={`fas fa-wrench text-[10px] opacity-50 ${statusColor}`}></i>
                <span className="text-gray-400 font-medium">{part.tool || 'Tool'}</span>
                <i className={`fas ${statusIcon} ${statusColor} text-[9px] ml-auto mr-1`}></i>
            </summary>
            <div className="ml-4 mt-1 rounded-lg bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                {part.state?.args && (
                    <div className="px-3 py-2 border-b border-white/[0.04]">
                        <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Args</span>
                        <pre className="text-xs text-gray-500 mt-1 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                            {JSON.stringify(part.state.args, null, 2)}
                        </pre>
                    </div>
                )}
                {part.state?.result && (
                    <div className="px-3 py-2">
                        <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Result</span>
                        <pre className="text-xs text-gray-500 mt-1 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                            {part.state.result}
                        </pre>
                    </div>
                )}
                {part.state?.error && (
                    <div className="px-3 py-2">
                        <span className="text-[10px] text-red-400/70 uppercase tracking-wider font-medium">Error</span>
                        <pre className="text-xs text-red-400/60 mt-1 font-mono whitespace-pre-wrap">
                            {part.state.error}
                        </pre>
                    </div>
                )}
            </div>
        </details>
    );
}


// ── Error Bubble ─────────────────────────────────────────────────────
function ErrorBubble({ message }: { message: ChatMessage }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fas fa-exclamation-triangle text-red-400 text-[10px]"></i>
            </div>
            <div className="pt-0.5">
                <p className="text-sm text-red-400/80 leading-relaxed">{message.content}</p>
            </div>
        </div>
    );
}


// ── Event Bubble ─────────────────────────────────────────────────────
function EventBubble({ message }: { message: ChatMessage }) {
    return (
        <div className="flex justify-center py-1">
            <span className="text-[11px] text-gray-600">
                {message.content}
            </span>
        </div>
    );
}
