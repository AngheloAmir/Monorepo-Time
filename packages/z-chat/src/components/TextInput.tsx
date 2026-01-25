import FetchToWho from "../_FetchToWho";
import useChatState from "../app/chat";
import SendIcon       from "./SendIcon";

export default function TextInput() {
    const chats          = useChatState.use.chats();
    const textinput      = useChatState.use.textinput();
    const setTextinput   = useChatState.use.setTextinput();
    const addChat        = useChatState.use.addChat();

    const handleSend = async () => {
        if (!textinput.trim()) return;
        addChat({
            id: Date.now(),
            who: "user",
            timestamp: Date.now(),
            message: textinput
        });
        setTextinput("");

        const userChat = chats.filter((chat) => chat.who === "user");
        const response = await FetchToWho(userChat);
        addChat({
            id: Date.now(),
            who: "system",
            timestamp: Date.now(),
            message: response
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 w-full">
            <div className="w-full max-w-3xl mx-auto">
                <div className="relative flex items-end gap-2 bg-zinc-900/80 hover:bg-zinc-900/90 focus-within:bg-black/90 transition-all duration-300 border border-white/10 rounded-[24px] p-2 pr-2 shadow-xl backdrop-blur-xl ring-1 ring-white/5 focus-within:ring-indigo-500/30">
                    <textarea
                        value={textinput}
                        onChange={(e) => setTextinput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message MonoChat..."
                        className="w-full pl-4 py-3 bg-transparent active:bg-transparent border-none outline-none focus:outline-none text-zinc-100 placeholder:text-zinc-500 focus:ring-0 resize-none max-h-48 min-h-[44px] scrollbar-hide text-md leading-6"
                        rows={1}
                        style={{ height: 'auto', minHeight: '44px' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.min(target.scrollHeight, 192)}px`;
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!textinput.trim()}
                        className={`p-2 rounded-full mb-1 transition-all duration-200 flex-shrink-0 ${textinput.trim()
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500'
                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
