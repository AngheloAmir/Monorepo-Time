import type { OpencodeGUIInstance } from "../../../../appstates/opencode";
import ChatHeader from "./Header";


export default function ChatOpencode( {instance}: {instance: OpencodeGUIInstance} ) {
    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0a] overflow-hidden">
            <ChatHeader instance={instance} />
        </div>
    );
}
