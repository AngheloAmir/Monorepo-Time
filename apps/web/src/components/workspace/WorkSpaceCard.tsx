import type { WorkspaceItem } from "../../appstates/workspace";
import useWorkspaceState from "../../appstates/workspace";
import GradientBody from "../ui/GradientBody";
import WorkSpaceCardButtons from "./WorkSpaceCardButtons";

export default function WorkspaceCard(props: WorkspaceItem) {
    const setActiveWorkspaceOptionModal = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();

    return (
        <GradientBody>
            <header className="p-3 flex items-start gap-4 bg-gradient-to-b from-white/5 to-transparent">
                <div className="w-10 h-10 rounded flex items-center justify-center border border-white/10">
                    <i className={`text-gray-400 text-xl ${props.info.fontawesomeIcon ?? 'fa fa-cube'}`}></i>
                </div>
                <div className="flex flex-col h-12 overflow-hidden flex-1">
                    <h3 className="text-base font-bold text-gray-200 group-hover:text-white leading-tight mb-1 transition-colors">
                        {props.info.name}
                    </h3>
                    <p className="text-gray-500 group-hover:text-gray-400 text-xs truncate transition-colors">
                        {props.info.description}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowNewTerminalWindow(props.info)}
                        className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-blue-600 hover:text-white text-gray-500 flex items-center justify-center transition-colors" >
                        <i className="fas fa-terminal text-xs"></i>
                    </button>
                    <button
                        onClick={() => setActiveWorkspaceOptionModal(props.info)}
                        className="group/btn flex-none w-8 h-8 rounded-lg border border-white/10 hover:border-white/30 text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center p-0" title="Options">
                        <i className="fas fa-cog group-hover/btn:rotate-90 transition-transform duration-300 text-xs"></i>
                    </button>
                </div>

            </header>

            <div className="mt-auto p-3 bg-black/20 border-t border-white/5 flex gap-2 relative">
                <WorkSpaceCardButtons {...props} />
            </div>
        </GradientBody>
    )
}