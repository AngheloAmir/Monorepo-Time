import { useEffect, useRef, useState } from "react";
import OpenCodeTerminal, { type OpenCodeTerminalRef } from "../OpenCodeTerminal";
import config from 'config';
import useAppState from "../../appstates/app";
import { OpenCodeContent, StartOpenCode } from "./_opencode";

import ProjectBrowser from "../opencode/ProjectBrowser";

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
    const [sidebarWidth, setSidebarWidth] = useState(265);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = e.clientX - 20; // - (padding/margin offset if any, assuming left align)
            // Ideally we check container offset, but usually Opencode is full width.
            // Let's assume absolute X for now, clamped.
            if (newWidth > 150 && newWidth < 600) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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
                onInstall={() => {
                    useAppState.getState().installOpenCode();
                    checkIfInstalled();
                    loadRootDir();
                }}
            />
        )

    return (
        <>
            <div 
                className={`h-[92%] w-full p-4 gap-2 ${props.isVisible && isRunning ? 'flex' : 'hidden'} ${isResizing ? 'select-none cursor-col-resize' : ''}`}
            >

                <div 
                    className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0"
                    style={{ width: sidebarWidth }}
                >
                    <ProjectBrowser />
                </div>

                <div 
                    className="w-1 h-full cursor-col-resize hover:bg-white/20 active:bg-blue-500 transition-colors rounded-full"
                    onMouseDown={() => setIsResizing(true)}
                />

                <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden border border-white/[0.08]">
                    <div className="w-full flex-1 min-h-0 bg-black/20">
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
                        terminalRef.current?.connect(rootDir, 'opencode');
                        terminalRef.current?.focus();
                    }
                }}
            />
        </>
    )
}