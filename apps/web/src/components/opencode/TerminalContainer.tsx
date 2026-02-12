import { useEffect, useRef, useState } from "react";
import config from 'config';
import type { OpenCodeTerminalRef } from "./OpenCodeTerminal";
import OpenCodeTerminal from "./OpenCodeTerminal";
import ReadyMessage     from "./ReadyMessage";

export interface TerminalInstance {
    id: string;
    title: string;
}

export interface TerminalTabProps {
    id: string;
    isActive: boolean;
    rootDir: string;
    isOpenCodeInstalled: boolean;
    loadingIfOpenCodeInstalled: boolean;
    onClose?: () => void;
}

export function TerminalTabContent({ isActive, rootDir, isOpenCodeInstalled, loadingIfOpenCodeInstalled }: TerminalTabProps) {
    const terminalRef               = useRef<OpenCodeTerminalRef>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [opacity, setOpacity]     = useState('opacity-0'); //this prevents flickering on tab switch
    
    useEffect(() => {
        if (isActive && terminalRef.current) {
            setOpacity('opacity-0');
            setTimeout(() => {
                terminalRef.current?.fit();
                terminalRef.current?.focus();
            }, 50);
            setTimeout(() => {
                setOpacity('opacity-100');
            }, 200);
        }
    }, [isActive]);

    return (
        <div className={` ${opacity} ${isActive ? '' : 'hidden'} relative w-full h-full flex flex-col `}>
             <OpenCodeTerminal
                ref={terminalRef}
                className={isRunning ? 'flex-1' : 'hidden'}
                socketUrl={config.serverPath}
                isActive={isActive}
                onExit={() => {
                    setIsRunning(false);
                }}
                onCrash={() => {
                    setIsRunning(false);
                }}
            />
            
            <ReadyMessage
                isVisible={isActive && !isRunning && isOpenCodeInstalled && !loadingIfOpenCodeInstalled}
                onStart={() => {
                    if (terminalRef.current) {
                        setIsRunning(true);
                        terminalRef.current?.fit();
                        terminalRef.current?.connect(rootDir, 'opencode');
                        terminalRef.current?.focus();
                    }
                }}
                onStartManual={() => {
                    if (terminalRef.current) {
                        setIsRunning(true);
                        terminalRef.current?.fit();
                        terminalRef.current?.connect(rootDir, 'bash');
                        terminalRef.current?.focus();
                    }
                }}
            />
        </div>
    );
}