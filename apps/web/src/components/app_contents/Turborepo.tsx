import { useEffect, useRef, useState } from "react";
import Button2 from "../ui/Button2";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../lib/InteractiveTerminal";
import useAppState from "../../appstates/app";
import useModal from "../../modal/modals";
import useWorkspaceState from "../../appstates/workspace";
import CICDTutorial from "./_cicdtutorial";
import config from 'config';
import TransparentCard from "../ui/TransparentCard";
import TerminalHeader from "../ui/TerminalHeader";
import commandGroups from "./_turborepo";

interface TurborepoProps {
    isVisible: boolean
}

export default function Turborepo(props: TurborepoProps) {
    const terminalRef = useRef<InteractiveTerminalRef>(null);
    const rootDir = useAppState.use.rootDir();
    const [isRunning, setIsRunning] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        if (config.useDemo) {
            terminalRef.current?.write("Demo mode is enabled");
            terminalRef.current?.write("\n");
            terminalRef.current?.write("Please use it in your local machine");
            terminalRef.current?.write("\n");
            terminalRef.current?.write("Visit https://www.npmjs.com/package/monorepotime to know more.");
            terminalRef.current?.write("\n");
            return;
        }

        return () => {
            if (terminalRef.current) {
                terminalRef.current.disconnect();
            }
        }
    }, []);

    const showModal = useModal.use.showModal();
    const workspaces = useWorkspaceState.use.workspace();

    function execute(cmd: string) {
        if (config.useDemo) {
            return;
        }

        if (terminalRef.current) {
            terminalRef.current.clear();
            terminalRef.current.disconnect();

            terminalRef.current.onClose(() => {
                setIsRunning(false);
            });
            terminalRef.current.onCrash(() => {
                setIsRunning(false);
            });
            
            setIsRunning(true);
            terminalRef.current.connect(rootDir, cmd);
            terminalRef.current.fit();
        }
    }

    function handleCommand(cmd: string) {
        if (config.useDemo) {
            return;
        }

        if (cmd === 'npx turbo prune' || cmd === 'npx turbo prune --docker') {
            showModal(
                'selection',
                'Select Workspace',
                'Choose a workspace to prune / dockerize',
                null,
                (selectedItem: any) => {
                    if (selectedItem) {
                        const isDocker = cmd.includes('--docker');
                        const newCmd = `npx turbo prune ${selectedItem.info.name}${isDocker ? ' --docker' : ''}`;
                        execute(newCmd);
                    }
                },
                workspaces
            );
            return;
        }
        execute(cmd);
    }

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
        <div className={`h-full w-full p-2 gap-2 ${props.isVisible ? 'flex' : 'hidden'}`}>
            <div className="w-[360px] lg:w-[440px] xl:w-[480px] flex-none h-full flex flex-col overflow-hidden">
                <button
                    onClick={() => setShowTutorial(true)}
                    className="mb-4 p-2 w-full rounded-lg border border-blue-500/20 
                               hover:border-blue-500/40 hover:from-blue-500/20 hover:to-purple-500/20
                               transition-all duration-300 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col text-left">
                            <span className="text-white font-semibold text-sm">CI/CD Tutorial</span>
                            <span className="text-gray-400 text-xs">Learn deployment with Vercel</span>
                        </div>
                        <i className="fas fa-chevron-right text-gray-500 ml-auto group-hover:text-blue-400 group-hover:translate-x-1 transition-all"></i>
                    </div>
                </button>

                {/* Scrollable Command Groups */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {commandGroups.map((group) => (
                        <TransparentCard key={group.title} title={group.title} description={""}>
                            {group.commands.map((c) => (
                                <Button2
                                    key={c.label}
                                    onClick={() => handleCommand(c.cmd)}
                                    name={c.label}
                                    description={c.cmd}
                                    color={c.color}
                                    icon={c.icon}
                                    disabled={isRunning}
                                />
                            ))}
                        </TransparentCard>
                    ))}
                </div>
            </div>

            {/* Right Panel - Terminal */}
            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded-xl overflow-hidden">
                <TerminalHeader
                    title="Terminal Output"
                    description="Execute commands"
                    icon="fas fa-terminal"
                    handleStop={handleStop}
                    isRunning={isRunning}
                >
                    Execute
                    <a
                        href="https://turborepo.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                        Turborepo
                    </a>
                    commands
                </TerminalHeader>

                {/* Terminal Body */}
                <div className="w-full flex-1 min-h-0 p-2 bg-black/20">
                    <InteractiveTerminal
                        ref={terminalRef}
                        isInteractive={true}
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
            
            {showTutorial && <CICDTutorial onClose={() => setShowTutorial(false)} />}
        </div>
    )
}