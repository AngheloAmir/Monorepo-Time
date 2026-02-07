
interface TerminalHeaderProps {
    title: string;
    description: string;
    icon: string;
    handleStop: () => void;
    isRunning: boolean;
    children: React.ReactNode;
}

export default function TerminalHeader(props: TerminalHeaderProps) {
    return (
        <header className="px-4 py-3 border-b border-white/[0.08] flex justify-between items-center bg-black/30 flex-none backdrop-blur-md">
            <div className="flex items-center gap-4">
                {/* Icon with animated ring */}
                <div className="relative">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 blur-md opacity-50`}></div>
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <i className={props.icon}></i>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                            {props.title}
                        </span>

                    </div>
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                        { props.children }
                    </span>
                </div>
            </div>

            <button
                onClick={props.handleStop}
                disabled={!props.isRunning}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200
                            ${props.isRunning
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 cursor-pointer'
                        : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                    }`}
            >
                <i className="fas fa-stop text-sm"></i>
                Stop
            </button>
        </header>
    )
}