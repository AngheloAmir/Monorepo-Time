import { useRef, useState } from "react";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../InteractiveTerminal";
import config from 'config';

// import Button2 from "../ui/Button2";
//import useAppState from "../../appstates/app";
// import TransparentCard from "../ui/TransparentCard";
import TerminalHeader from "../ui/TerminalHeader";

interface CloudflareProps {
    isVisible: boolean
}

export default function OpenCode(props: CloudflareProps) {
    const terminalRef = useRef<InteractiveTerminalRef>(null);
    //const rootDir = useAppState.use.rootDir();
    const [isRunning, setIsRunning] = useState(false);

    function handleStop() {
        if (config.useDemo) {
            return;
        }
        if (terminalRef.current) {
            terminalRef.current.disconnect();
            setIsRunning(false);
        }
    }

    return (
        <div className={`h-[92%] w-full p-4 gap-6 ${props.isVisible ? 'flex' : 'hidden'}`}>

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded-xl overflow-hidden border border-white/[0.08]">
                <TerminalHeader
                    title="Vibe Code with OpenCode AI"
                    description="OpenCode Terminal"
                    icon="fas fa-terminal"
                    handleStop={handleStop}
                    isRunning={isRunning}
                >
                    OpenCode
                </TerminalHeader>

                <div className="w-full flex-1 min-h-0 p-2 bg-black/20">
                    <InteractiveTerminal
                        ref={terminalRef}
                        className="h-full w-full"
                        socketUrl={config.serverPath}
                        onExit={() => {
                            setIsRunning(false);
                        }}
                        onCrash={() => {
                            setIsRunning(false);
                        }}
                    />
                </div>
            </div>


        </div>
    )
}