import { useEffect, useRef } from "react";
import useChatState from "../app/chat";

export default function ChatContents() {
    const chats = useChatState.use.chats();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chats]);

    return (
        <div className="flex-1 overflow-y-auto w-full px-4 scrollbar-hide">
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    className={`group flex w-full ${chat.who === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex max-w-[85%] md:max-w-[80%] gap-4 ${chat.who === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex flex-col ${chat.who === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-center gap-2 mb-1.5 opacity-90 ${chat.who === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className="text-[10px] text-zinc-500">
                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div
                                className={`relative px-5 py-3 rounded-2xl text-md leading-relaxed  transition-transform duration-200 ${chat.who === 'user'
                                    ? 'bg-zinc-800/80 text-white rounded-tr-sm border border-zinc-700/50 shadow-lg backdrop-blur-sm'
                                    : ' text-zinc-100'
                                    }`}
                            >
                                {chat.message}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
        </div>
    )
}