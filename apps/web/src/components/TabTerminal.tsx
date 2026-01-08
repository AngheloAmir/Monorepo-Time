import { useEffect, useState } from "react";
import useWorkspaceState, { type WorkspaceItem } from "../_context/workspace";
import Console from "./Console";

export default function TabTerminal() {
    const workspace = useWorkspaceState.use.workspace();
    const [activeTerminal, setActiveTerminal] = useState<WorkspaceItem | null>(null);
    const [terminalHeight, setTerminalHeight] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            const workspaceContainer = document.getElementById("workspaceContainer");
            if (workspaceContainer) 
                setTerminalHeight(window.innerHeight - workspaceContainer.offsetHeight - 110);
        }, 10);
    }, []);

    return (
        <div className="w-full h-full flex flex-col">
            <header className="w-full pt-1 flex bg-gray-800 min-h-8 flex-wrap gap-2 select-none flex-none">
                {workspace.map((item, index) => {
                    if (item.isRunningAs == 'dev' || item.isRunningAs == 'start')
                        return (
                            <div
                                key={index}
                                className={`px-2 w-[200px] gap-2 flex ${activeTerminal?.info.name === item.info.name ? 'bg-gray-800' : 'mb-1 cursor-pointer bg-gray-700 hover:bg-gray-600'}`}
                                onClick={() => setActiveTerminal(item)}>
                                <div className="flex-1 flex items-center gap-2 truncate overflow-hidden">
                                    <i className={`${item.info.fontawesomeIcon ?? 'fas fa-terminal'} text-[18px] flex-shrink-0`}></i>
                                    <span className="truncate font-medium text-[16px]">
                                        {item.info.name}
                                    </span>
                                </div>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTerminal(null);
                                }}>
                                    <li className="fa fa-times"></li>
                                </button>
                            </div>
                        )
                    return null;
                })}
            </header>

            <Console
                consoleOutput={(activeTerminal && activeTerminal.consoleOutput) ?? ""}
                componentHeight={terminalHeight}
            />

        </div>
    );
}