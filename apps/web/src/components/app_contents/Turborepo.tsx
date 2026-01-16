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

export const commands = [
    { label: 'Install', cmd: 'npm install', icon: 'fa-download', color: 'blueIndigo' },
    { label: 'Build', cmd: 'turbo build', icon: 'fa-hammer', color: 'emeraldTeal' },
    { label: 'Lint', cmd: 'turbo lint', icon: 'fa-check-double', color: 'yellowOrange' },
    { label: 'Test', cmd: 'turbo test', icon: 'fa-vial', color: 'pinkRose' },
    { label: 'Clean', cmd: 'turbo clean', icon: 'fa-broom', color: 'gray' },
    { label: 'Summary', cmd: 'turbo run build --dry-run', icon: 'fa-list-alt' },
    { label: 'Prune', cmd: 'turbo prune', icon: 'fa-scissors', color: 'red' },
    { label: 'Docker', cmd: 'turbo prune --docker', icon: 'fa-docker', color: 'skyBlue' },
    { label: 'Remote', cmd: 'npx turbo link', icon: 'fa-cloud', color: 'cyanBlue' },
    { label: 'Cache', cmd: 'rm -rf node_modules/.cache/turbo .turbo', icon: 'fa-trash-alt', color: 'darkRed' },
];

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

            terminalRef.current.connect(rootDir, cmd);
            terminalRef.current.fit();
            terminalRef.current.onClose(() => {
                setIsRunning(false);
            });
            terminalRef.current.onCrash(() => {
                setIsRunning(false);
            });
            setIsRunning(true);
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
        <div className={`h-[92%] w-full p-4 gap-4 ${props.isVisible ? 'flex' : 'hidden'}`}>
            <div className="w-[500px] flex-none h-full flex flex-col align-center">
                <button
                    onClick={() => setShowTutorial(true)}
                    className="mb-6 text-sm w-full text-blue-200 flex items-center justify-center gap-2 transition-all group"
                >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fas fa-book-reader text-blue-400 text-sm"></i>
                    </div>
                    CI/CD Tutorial with Vercel
                </button>

                <div className="grid grid-cols-2 gap-3">
                    {commands.map((c) => (
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

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col p-[1px] rounded overflow-hidden shadow-[0_0_100px_-20px_rgba(168,85,247,0.3)]">

                {/* Gradient Border */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-50"></div> */}

                {/* Content Container */}
                <div className="relative flex-1 h-full flex flex-col rounded-xl overflow-hidden">
                    <header className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-black/20 flex-none backdrop-blur-sm">
                        <div className="text-md font-bold text-white flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <i className="fas fa-rocket text-white text-sm"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-bold">
                                    Non Interactive Terminal
                                </span>
                                <span className="text-gray-400 font-normal text-sm truncate w-full text-xs">
                                    Execute
                                    <a
                                        href="https://turborepo.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-blue-500 hover:underline">
                                        Turborepo.js
                                    </a>
                                    commands
                                </span>
                            </div>
                        </div>

                        <button onClick={handleStop}
                            className={`text-gray-400 transition-colors flex items-center gap-2 ${isRunning ? 'text-red-500' : 'text-gray-400'}`}>
                            <li className="fas fa-stop text-lg"></li>
                            STOP
                        </button>
                    </header>

                    <div className="w-full flex-1 min-h-0 p-1">
                        <InteractiveTerminal
                            ref={terminalRef}
                            isInteractive={false}
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
            {showTutorial && <CICDTutorial onClose={() => setShowTutorial(false)} />}
        </div>
    )
}