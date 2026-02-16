import { useEffect } from "react";
import type { OpencodeGUIInstance } from "../../../../appstates/opencode";
import ChatHeader from "./Header";
import useChatStore from "./_store";

export default function ChatOpencode({ instance }: { instance: OpencodeGUIInstance }) {
    const init = useChatStore.use.init();
    const chat = useChatStore.use.chat();

    useEffect(() => {
        init(instance.instance.url);
    }, []);


    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0a] overflow-hidden">
            <ChatHeader instance={instance} />

            <input type="text" />
            <button onClick={async () => {
                await chat(
                    "Analyze the code, dont change any code",
                    (event) => {
                        if (event.kind === 'text')
                            console.log(event.text);
                        if (event.kind === 'reasoning')
                            console.log(event.text);
                        if (event.kind === 'tool')
                            console.log('Tool:', event.tool);
                        if (event.kind === 'step-start')
                            console.log('Step Start');
                        if (event.kind === 'step-finish')
                            console.log('Step Finish:', event.reason);
                        if (event.kind === 'subtask')
                            console.log('Subtask:', event.description);
                        if (event.kind === 'status')
                            console.log('Status:', event.status);
                        if (event.kind === 'error')
                            console.log(event.error);
                    },
                    (_message) => console.log('Done!'),   // onEnd
                );
            }}>
                Test Chat
            </button>




        </div >
    );
}
