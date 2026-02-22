import { useEffect, useState, useRef } from "react";
import type { OpencodeGUIInstance } from "../../../../appstates/opencode";
import ChatHeader from "./Header";
import useChatStore from "./_opencode";

// Component to render individual message items
const MessageItem = ({ item }: { item: { kind: string; text?: string; tool?: any; description?: string } }) => {
    switch (item.kind) {
        case 'user':
            return (
                <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] break-words shadow-md">
                        {item.text}
                    </div>
                </div>
            );
        case 'text':
            return (
                <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#1e1e1e] text-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] break-words border border-gray-800 shadow-sm leading-relaxed whitespace-pre-wrap">
                        {item.text}
                    </div>
                </div>
            );
        case 'reasoning':
            return (
                <div className="flex justify-start mb-2 px-1 w-full animate-in fade-in duration-300">
                    <div className="text-gray-500 text-sm italic border-l-2 border-gray-700 pl-4 py-1 w-full max-w-[90%]">
                        <span className="text-xs uppercase font-bold text-gray-600 not-italic block mb-1">Thinking Process</span>
                        <div className="whitespace-pre-wrap">{item.text}</div>
                    </div>
                </div>
            );
        case 'tool':
            return (
                <div className="flex justify-start mb-4 w-full animate-in fade-in duration-300">
                    <div className="bg-[#111] border border-gray-800 rounded-lg p-3 max-w-[90%] font-mono text-xs w-full overflow-hidden shadow-inner">
                        <div className="text-emerald-500 mb-2 flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                            Tool Execution
                        </div>
                        <div className="text-gray-400 overflow-x-auto whitespace-pre-wrap bg-black/50 p-2 rounded">
                            {typeof item.tool === 'string' ? item.tool : JSON.stringify(item.tool, null, 2)}
                        </div>
                    </div>
                </div>
            );
        case 'subtask':
            return (
                <div className="flex justify-center my-4 w-full animate-in fade-in duration-300">
                    <div className="bg-gray-900/80 text-gray-400 text-xs px-3 py-1.5 rounded-full border border-gray-800 flex items-center gap-2">
                        <span>🎯</span>
                        <span>{item.description}</span>
                    </div>
                </div>
            );
        case 'error':
            return (
                <div className="flex justify-start mb-4 w-full animate-in fade-in duration-300">
                    <div className="bg-red-950/30 text-red-400 px-4 py-2 rounded-lg border border-red-900/30 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Error: {item.text}
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export default function ChatOpencode({ instance }: { instance: OpencodeGUIInstance }) {
    const init = useChatStore.use.init();
    const chat = useChatStore.use.chat();
    const createSession = useChatStore.use.createSession();

    const [messages, setMessages] = useState<{ kind: string; text?: string; tool?: any; description?: string }[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    
    // Tracking active streaming content for UI display
    const [streamedText, setStreamedText] = useState('');
    const [streamedKind, setStreamedKind] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const start = async () => {
            if (instance?.instance?.url) {
                await init(instance.instance.url);
                await createSession();
            }
        }
        start();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamedText, streamedKind]);

    async function handleSend() {
        if (!input.trim() || isStreaming) return;
        
        const userText = input;
        setInput('');
        setIsStreaming(true);
        
        // Optimistically add user message
        setMessages(prev => [...prev, { kind: 'user', text: userText }]);

        // Local state to manage accumulation during the callback closures
        let activeText = "";
        let activeKind: string | null = null;
        let activePartID: string | null = null;
        
        // Track how much of each part we have already "flushed" to the messages list
        // to avoid duplicating text when streams are interleaved.
        const committedLengths = new Map<string, number>();

        const flushActive = () => {
             if (activeText && activeKind) {
                 const previouslyCommitted = activePartID ? (committedLengths.get(activePartID) || 0) : 0;
                 const textToCommit = activeText.slice(previouslyCommitted);
                 
                 if (textToCommit) {
                     setMessages(prev => [...prev, { kind: activeKind!, text: textToCommit }]);
                     if (activePartID) {
                         committedLengths.set(activePartID, activeText.length);
                     }
                 }
             }
        };

        await chat(
            userText,
            (event) => {
                // Handle immediate events that interrupt the stream
                if (event.kind === 'tool' || event.kind === 'subtask' || event.kind === 'error') {
                     flushActive();
                     
                     // Reset active tracking for the stream
                     activeKind = null; 
                     activePartID = null;
                     activeText = "";
                     setStreamedText("");
                     setStreamedKind(null);
                     
                     if (event.kind === 'tool') {
                         setMessages(prev => [...prev, { kind: 'tool', tool: event.tool }]);
                     } else if (event.kind === 'subtask') {
                         setMessages(prev => [...prev, { kind: 'subtask', description: event.description }]);
                     } else if (event.kind === 'error') {
                         setMessages(prev => [...prev, { kind: 'error', text: (event as any).error?.data?.message || "Unknown error" }]);
                     }
                     return;
                }

                if (event.kind === 'status' || event.kind === 'step-start' || event.kind === 'step-finish') {
                     return;
                }

                // Normal streaming events (text, reasoning)
                if (event.kind === 'text' || event.kind === 'reasoning') {
                    const isNewKind = activeKind && activeKind !== event.kind;
                    const isNewPart = activePartID && activePartID !== event.partID;

                    if (isNewKind || isNewPart) {
                        flushActive();
                        // Note: We don't manually reset activeText to "" here because 
                        // event.text (below) provides the full content for the new state.
                        setStreamedText("");
                    }

                    activeKind = event.kind;
                    activePartID = event.partID;
                    setStreamedKind(event.kind);
                    activeText = event.text; 
                    
                    // Show only the uncommitted portion in the streaming bubble
                    const previouslyCommitted = activePartID ? (committedLengths.get(activePartID) || 0) : 0;
                    setStreamedText(activeText.slice(previouslyCommitted));
                }
            },
            (_message) => {
                // Final flush when chat is done
                flushActive();
                setStreamedText("");
                setStreamedKind(null);
                setIsStreaming(false);
            },
        );
    }

    async function downloadLogs() {
        const logContent = messages.map(m => {
            const timestamp = new Date().toISOString();
            if (m.kind === 'reasoning') {
                return `[${timestamp}] [THINKING] \n${m.text}\n`;
            } else if (m.kind === 'tool') {
                return `[${timestamp}] [TOOL] \n${JSON.stringify(m.tool, null, 2)}\n`;
            } else if (m.kind === 'subtask') {
                return `[${timestamp}] [SUBTASK] ${m.description}\n`;
            } else if (m.kind === 'error') {
                return `[${timestamp}] [ERROR] ${m.text}\n`;
            } else if (m.kind === 'user') {
                return `[${timestamp}] [USER] \n${m.text}\n`;
            } else {
                return `[${timestamp}] [AI] \n${m.text}\n`;
            }
        }).join('\n---\n');

        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-logs-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0a] text-white">
            <ChatHeader instance={instance} onSaveLogs={downloadLogs} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <MessageItem key={idx} item={msg} />
                ))}

                {/* Active Streaming Item */}
                {isStreaming && streamedKind && streamedText && (
                    <div className="opacity-90">
                         <MessageItem item={{ kind: streamedKind, text: streamedText }} />
                    </div>
                )}
                
                {/* Loading State */}
                {isStreaming && !streamedText && !streamedKind && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-[#1e1e1e] p-3 rounded-2xl rounded-tl-sm border border-gray-800">
                             <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-0"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0a] border-t border-gray-800">
                <div className="relative max-w-4xl mx-auto w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask the agent..."
                        className="w-full bg-[#161616] text-gray-200 border border-gray-800 rounded-xl py-3.5 px-5 pr-12 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder-gray-600 shadow-sm"
                        disabled={isStreaming}
                        autoFocus
                    />
                    <button
                        onClick={handleSend}
                        disabled={isStreaming || !input.trim()}
                        className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors duration-200 ${
                            isStreaming || !input.trim() 
                                ? 'text-gray-600 cursor-not-allowed opacity-50' 
                                : 'text-blue-500 hover:bg-blue-500/10 hover:scale-105 active:scale-95'
                        }`}
                        title="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">Simulated AI Environment</p>
                </div>
            </div>
        </div >
    );
}
