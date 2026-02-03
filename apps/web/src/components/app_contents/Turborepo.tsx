import { useEffect, useRef, useState } from "react";
import Button2 from "../ui/Button2";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../InteractiveTerminal";
import useAppState from "../../appstates/app";
import useModal from "../../modal/modals";
import useWorkspaceState from "../../appstates/workspace";
import CICDTutorial from "../CICDTutorial";
import config from 'config';

interface TurborepoProps {
    isVisible: boolean
}

// Grouped commands for better organization
const commandGroups = [
    {
        title: 'Build & Run',
        commands: [
            { label: 'Install', cmd: 'npm install', icon: 'fa-download', color: 'blueIndigo' },
            { label: 'Build', cmd: 'turbo build', icon: 'fa-hammer', color: 'emeraldTeal' },
        ]
    },
    {
        title: 'Code Quality',
        commands: [
            { label: 'Lint', cmd: 'turbo lint', icon: 'fa-check-double', color: 'yellowOrange' },
            { label: 'Test', cmd: 'turbo test', icon: 'fa-vial', color: 'pinkRose' },
        ]
    },
    {
        title: 'Optimization',
        commands: [
            { label: 'Prune', cmd: 'turbo prune', icon: 'fa-scissors', color: 'red' },
            { label: 'Docker', cmd: 'turbo prune --docker', icon: 'fa-docker', color: 'skyBlue' },
            { label: 'Summary', cmd: 'turbo run build --dry-run', icon: 'fa-list-alt' },
        ]
    },
    {
        title: 'Maintenance',
        commands: [
            { label: 'Clean', cmd: 'turbo clean', icon: 'fa-broom', color: 'gray' },
            { label: 'Cache', cmd: 'rm -rf node_modules/.cache/turbo .turbo', icon: 'fa-trash-alt', color: 'darkRed' },
            { label: 'Remote', cmd: 'npx turbo link', icon: 'fa-cloud', color: 'cyanBlue' },
        ]
    },
];

// Flat commands list for export compatibility
export const commands = commandGroups.flatMap(group => group.commands);

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

        if (cmd === 'turbo prune' || cmd === 'turbo prune --docker') {
            showModal(
                'selection',
                'Select Workspace',
                'Choose a workspace to prune / dockerize',
                null,
                (selectedItem: any) => {
                    if (selectedItem) {
                        const isDocker = cmd.includes('--docker');
                        const newCmd = `turbo prune ${selectedItem.info.name}${isDocker ? ' --docker' : ''}`;
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
        <div className={`h-[92%] w-full p-4 gap-6 ${props.isVisible ? 'flex' : 'hidden'}`}>
            {/* Left Panel - Commands */}
            <div className="w-[300px] lg:w-[420px] xl:w-[450px]  flex-none h-full flex flex-col overflow-hidden">
                {/* Tutorial Button - Top Card */}
                <button
                    onClick={() => setShowTutorial(true)}
                    className="mb-4 w-full p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 
                               hover:border-blue-500/40 hover:from-blue-500/20 hover:to-purple-500/20
                               transition-all duration-300 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center 
                                      group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                            <i className="fas fa-book-reader text-white text-lg"></i>
                        </div>
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
                        <div key={group.title} className="rounded bg-gray-800/40 border border-white/[0.1] overflow-hidden">
                            {/* Group Header */}
                            <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-3">
                                <span className="text-gray-300 font-medium text-sm">{group.title}</span>
                                <span className="ml-auto text-gray-600 text-xs">{group.commands.length} commands</span>
                            </div>
                            
                            {/* Group Commands */}
                            <div className="p-2 grid grid-cols-2 gap-2">
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Terminal */}
            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded-xl overflow-hidden border border-white/[0.08] shadow-[0_0_100px_-20px_rgba(168,85,247,0.3)]">
                {/* Terminal Header */}
                <header className="px-4 py-3 border-b border-white/[0.08] flex justify-between items-center bg-black/30 flex-none backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        {/* Icon with animated ring */}
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 blur-md opacity-50 ${isRunning ? 'animate-pulse' : ''}`}></div>
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <i className={`fas ${isRunning ? 'fa-spinner fa-spin' : 'fa-terminal'} text-white text-lg`}></i>
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                    Terminal Output
                                </span>
                                {isRunning && (
                                    <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium animate-pulse">
                                        Running
                                    </span>
                                )}
                            </div>
                            <span className="text-gray-500 text-xs flex items-center gap-1">
                                Execute
                                <a
                                    href="https://turborepo.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                    Turborepo
                                </a>
                                commands
                            </span>
                        </div>
                    </div>

                    {/* Stop Button */}
                    <button 
                        onClick={handleStop}
                        disabled={!isRunning}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200
                            ${isRunning 
                                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 cursor-pointer' 
                                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <i className="fas fa-stop text-sm"></i>
                        Stop
                    </button>
                </header>

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