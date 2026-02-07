import { useEffect, useRef, useState } from "react";
import OpenCodeTerminal, { type OpenCodeTerminalRef } from "../OpenCodeTerminal";
import config from 'config';
import useAppState from "../../appstates/app";
import { OpenCodeContent, StartOpenCode } from "./_opencode";

interface CloudflareProps {
    isVisible: boolean
}

export default function OpenCode(props: CloudflareProps) {
    const terminalRef = useRef<OpenCodeTerminalRef>(null);
    const isOpenCodeInstalled = useAppState.use.isOpenCodeInstalled();
    const checkIfInstalled = useAppState.use.checkIfInstalled();
    const rootDir = useAppState.use.rootDir();
    const loadRootDir = useAppState.use.loadRootDir();
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        checkIfInstalled();
        loadRootDir();
    }, []);

    useEffect(() => {
        if (props.isVisible && terminalRef.current) {
            setTimeout(() => {
                terminalRef.current?.fit();
            }, 50);
        }
    }, [props.isVisible]);

    if (!isOpenCodeInstalled)
        return (
            <OpenCodeContent
                isVisible={props.isVisible}
                onInstall={() => useAppState.getState().installOpenCode()}
            />
        )

    return (
        <>
            <div className={`h-[92%] w-full p-4 gap-6 ${props.isVisible && isRunning ? 'flex' : 'hidden'}`}>
                <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden border border-white/[0.08]">
                    <div className="w-full flex-1 min-h-0 p-2 bg-black/20">
                        <OpenCodeTerminal
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

            <StartOpenCode
                isVisible={props.isVisible && !isRunning}
                onStart={() => {
                    if (terminalRef.current) {
                        setIsRunning(true);
                        terminalRef.current?.fit();
                        terminalRef.current?.connect(rootDir, 'npm run opencode');
                        terminalRef.current?.focus();
                    }
                }}
            />
        </>
    )
}