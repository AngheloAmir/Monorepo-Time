import { useEffect, useRef, useState } from "react";
import Button2 from "../ui/Button2";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../InteractiveTerminal";
import useAppState from "../../appstates/app";
import config from 'config';
import TransparentCard from "../ui/TransparentCard";
import TerminalHeader from "../ui/TerminalHeader";
import { commandGroups, type Command } from "./_network";
import useModal from "../../modal/modals";

interface NetworkProps {
    isVisible: boolean
}

export default function NetworkUtility(props: NetworkProps) {
    const terminalRef = useRef<InteractiveTerminalRef>(null);
    const rootDir = useAppState.use.rootDir();
    const [isRunning, setIsRunning] = useState(false);
    const showModal = useModal.use.showModal();

    useEffect(() => {
        if (config.useDemo) {
            terminalRef.current?.write("🌐 Network Utility Tool - Demo Mode\n");
            return;
        }
        return () => {
            if (terminalRef.current) terminalRef.current.disconnect();
        }
    }, []);

    function execute(cmd: string) {
        if (config.useDemo) return;

        if (terminalRef.current) {
            terminalRef.current.clear();
            terminalRef.current.disconnect();

            terminalRef.current.onClose(() => setIsRunning(false));
            terminalRef.current.onCrash(() => setIsRunning(false));

            setIsRunning(true);
            terminalRef.current.connect(rootDir, cmd);
            terminalRef.current.fit();
        }
    }

    function getOsCommand(command: Command) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.includes("win") && command.cmdWindow) {
            return command.cmdWindow;
        }
        if (userAgent.includes("mac") && command.cmdMac) {
            return command.cmdMac;
        }
        return command.cmd;
    }

    function handleCommandClick(command: Command) {
        if (command.requiresInput) {
            showModal(
                'prompt',
                command.label,
                command.confirmMessage ?? "",
                "warning",
                (value: any) => {
                    if (value) {
                        const cleanInput = value.trim();
                        if (!cleanInput && !command.cmd.includes("docker stats")) {
                            if (!command.inputPlaceholder?.includes("Optional")) {
                                return;
                            }
                        }
                        let finalCmd = getOsCommand(command).replace('{{input}}', cleanInput);
                        execute(finalCmd);
                    }
                },
                null,
                command.inputPlaceholder
            )
        } else {
            execute(getOsCommand(command));
        }
    }

    function handleStop() {
        if (config.useDemo) return;
        terminalRef.current?.disconnect();
        setIsRunning(false);
    }

    return (
        <>
            <div className={`h-full w-full p-2 gap-2 ${props.isVisible ? 'flex' : 'hidden'}`}>
                <div className="w-[360px] lg:w-[440px] xl:w-[480px] flex-none h-full flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {commandGroups.map((group) => (
                            <TransparentCard key={group.title} title={group.title} description={""}>
                                {group.commands.length > 0 && group.commands.map((c) => (
                                    <Button2
                                        key={c.label}
                                        onClick={() => handleCommandClick(c)}
                                        name={c.label}
                                        description={c.displayCmd}
                                        color={c.color}
                                        icon={c.icon}
                                        disabled={isRunning}
                                    />
                                ))}
                            </TransparentCard>
                        ))}
                    </div>
                </div>

                <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded-xl overflow-hidden">
                    <TerminalHeader
                        title="Terminal Output"
                        description="Real-time command execution results"
                        icon="fas fa-terminal"
                        handleStop={handleStop}
                        isRunning={isRunning}
                    >
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Results will appear here automatically</span>
                        </div>
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
        </>
    )
}