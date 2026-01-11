import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../components/InteractiveTerminal";
import useAppState from "../_context/app";
import useModal from "../modal/modals";
import useWorkspaceState from "../_context/workspace";

interface TurborepoProps {
    isVisible: boolean
}

export const commands = [
    { label: 'Install', cmd: 'npm install', icon: 'fa-download', color: 'from-blue-500 to-indigo-600' },
    { label: 'Build', cmd: 'turbo build', icon: 'fa-hammer', color: 'from-emerald-500 to-teal-600' },
    { label: 'Lint', cmd: 'turbo lint', icon: 'fa-check-double', color: 'from-yellow-500 to-orange-600' },
    { label: 'Test', cmd: 'turbo test', icon: 'fa-vial', color: 'from-pink-500 to-rose-600' },
    { label: 'Clean', cmd: 'turbo clean', icon: 'fa-broom', color: 'from-gray-500 to-gray-600' },
    { label: 'Summary', cmd: 'turbo run build --dry-run', icon: 'fa-list-alt' },
    { label: 'Prune', cmd: 'turbo prune', icon: 'fa-scissors', color: 'from-red-500 to-red-600' },
    { label: 'Docker', cmd: 'turbo prune --docker', icon: 'fa-docker', color: 'from-blue-400 to-blue-500' },
    { label: 'Remote', cmd: 'npx turbo link', icon: 'fa-cloud', color: 'from-cyan-500 to-blue-600' },
    { label: 'Cache', cmd: 'rm -rf node_modules/.cache/turbo .turbo', icon: 'fa-trash-alt', color: 'from-red-600 to-red-700' },
];

export default function Turborepo(props: TurborepoProps) {
    const terminalRef = useRef<InteractiveTerminalRef>(null);
    const rootDir = useAppState.use.rootDir();
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        return () => {
            if (terminalRef.current) {
                terminalRef.current.disconnect();
            }
        }
    }, []);

    const showModal = useModal.use.showModal();
    const workspaces = useWorkspaceState.use.workspace();

    function execute(cmd: string) {
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
        if (terminalRef.current) {
            terminalRef.current.disconnect();
            setIsRunning(false);
        }
    }

    return (
        <div className={`h-[92%] w-full p-4 gap-4 ${props.isVisible ? 'flex' : 'hidden'}`}>
            <div className="w-[500px] flex-none h-full flex flex-col align-center mt-8">
                <div className="grid grid-cols-2 gap-3">
                    {commands.map((c) => (
                        <Button
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

            <div className="bg-[#111827] relative flex-1 h-full min-h-0 min-w-0 overflow-hidden flex flex-col">
                <header className="px-4 py-2 border-gray-700 flex justify-between items-center bg-gray-800/50 flex-none">
                    <div className="text-md font-bold text-white flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <i className="fas fa-rocket text-white text-sm"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl">
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