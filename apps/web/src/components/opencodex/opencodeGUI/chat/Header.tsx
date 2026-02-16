import type { OpencodeGUIInstance } from "../../../../appstates/opencode";

export default function ChatHeader( {instance}: {instance: OpencodeGUIInstance} ) {
    const apiBase = `http://localhost:${instance.instance.port}`;

    return (
        <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06]">
            <button className="flex items-center gap-2"
                onClick={() => {
                    window.open(apiBase, '_blank');
                }}
            >
                Open Opencode Official Web app
            </button>
        </div>
    );
}