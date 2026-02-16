import { useEffect, useState } from "react";
import type { OpencodeGUIInstance } from "../../../../appstates/opencode";
import ChatHeader from "./Header";
import useChatStore from "./_opencode";

export default function ChatOpencode({ instance }: { instance: OpencodeGUIInstance }) {
    const init = useChatStore.use.init();
    const chat = useChatStore.use.chat();
    const createSession = useChatStore.use.createSession();

    useEffect(() => {
        const start = async () => {
            await init(instance.instance.url);
            await createSession();
        }
        start();
    }, []);


    const [currentTool, setCurrentTool]       = useState<string | null>(null);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [messages, setMessages]             = useState<{ kind: string; text: string }[]>([]);
    async function Chat() {
        await chat(
            "Analyze the code, dont change any code",
            (event) => {
                if( currentTool && currentTool != event.kind ) {
                    setMessages((prev) => [...prev, { kind: currentTool, text: currentMessage }]);
                    setCurrentTool(event.kind);
                    setCurrentMessage("");
                }
                switch (event.kind) {
                    case 'text':
                        setCurrentMessage(event.text);
                        break;
                    case 'reasoning':
                        setCurrentMessage(event.text);
                        break;
                    case 'tool':
                        setCurrentMessage(event.tool);
                        break;
                    case 'step-start':
                        setMessages((prev) => [...prev, { kind: "step-start", text: currentMessage }]);
                        break;
                    case 'step-finish':
                        setCurrentMessage(event.reason);
                        break;
                    case 'subtask':
                        setCurrentMessage(event.description);
                        break;
                    case 'status':
                        setCurrentMessage(event.status);
                        break;
                    case 'error':
                        setMessages((prev) => [...prev, { kind: "error", text: currentMessage }]);
                        break;
                }
            },
            (_message) => {
                setCurrentTool(null);
                setCurrentMessage('');
            },
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0a]">
            <ChatHeader instance={instance} />

            <input type="text" />
            <button onClick={() => Chat()}>
                Test Chat
            </button>

            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <p>{msg.kind}: {msg.text}</p>
                    </div>
                ))}
            </div>
            <div>
                {currentMessage}
            </div>

        </div >
    );
}
