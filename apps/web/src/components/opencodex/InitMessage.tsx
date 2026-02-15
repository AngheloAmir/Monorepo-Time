import useOpencode from "../../appstates/opencode";

export default function ReadyMessage({ isVisible, onStart }: { isVisible: boolean, onStart: () => void }) {
    const isOpencodeInstalled = useOpencode.use.isOpencodeInstalled();

    if (!isVisible) return null;
    return (
        <div className={`h-full w-full flex items-center justify-center p-4`}>
            <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 mb-12 w-full">
                    {/* Left Column: Animation */}
                    <div className="flex-shrink-0">
                        <div className="relative w-80 h-48 bg-gray-900/80 overflow-hidden flex  select-none">
                            <style>{`
                            @keyframes drag-move {
                                0%, 15% { transform: translate(0, 0); }
                                25% { transform: translate(5px, 5px); }
                                60% { transform: translate(140px, 20px); }
                                80% { transform: translate(140px, 20px); opacity: 1; }
                                85% { transform: translate(140px, 20px); opacity: 0; }
                                100% { transform: translate(0, 0); opacity: 0; }
                            }
                            @keyframes cursor-move {
                                0%, 10% { transform: translate(0, 0); }
                                25% { transform: translate(15px, 25px) scale(0.9); }
                                60% { transform: translate(150px, 40px) scale(0.9); }
                                80% { transform: translate(150px, 40px) scale(1); }
                                100% { transform: translate(0, 0); }
                            }
                            @keyframes terminal-glow {
                                    0%, 55% { border-color: transparent; background-color: transparent; }
                                    60%, 80% { border-color: rgba(59, 130, 246, 0.4); background-color: rgba(59, 130, 246, 0.1); }
                                    100% { border-color: transparent; background-color: transparent; }
                            }
                            .animate-drag-file { animation: drag-move 4s ease-in-out infinite; }
                            .animate-drag-cursor { animation: cursor-move 4s ease-in-out infinite; }
                            .animate-terminal-glow { animation: terminal-glow 4s ease-in-out infinite; }
                        `}</style>

                            {/* Simulated Project Browser (Left) */}
                            <div className="w-1/3 h-full border-r border-white/10 bg-gray-800/30 p-3 flex flex-col gap-2 relative text-left">
                                <div className="h-2 w-16 bg-white/10 rounded mb-1"></div>

                                {/* Static Files */}
                                <div className="flex items-center gap-2 text-white/20">
                                    <i className="fas fa-folder text-[10px]"></i>
                                    <div className="h-1.5 w-12 bg-white/10 rounded"></div>
                                </div>

                                {/* The "Source" File for Animation */}
                                <div className="flex items-center gap-2 text-blue-400/80 bg-blue-500/10 p-1 rounded -ml-1">
                                    <i className="fas fa-file-code text-xs"></i>
                                    <span className="text-[10px] font-mono">app.ts</span>
                                </div>

                                <div className="flex items-center gap-2 text-white/20">
                                    <i className="fas fa-file text-[10px]"></i>
                                    <div className="h-1.5 w-10 bg-white/10 rounded"></div>
                                </div>

                                {/* Flying File Copy */}
                                <div className="absolute top-[46px] left-[12px] flex items-center gap-2 text-blue-400 bg-blue-500/20 p-1 rounded border border-blue-500/30 z-20 animate-drag-file shadow-lg pointer-events-none">
                                    <i className="fas fa-file-code text-xs"></i>
                                    <span className="text-[10px] font-mono">app.ts</span>
                                </div>
                            </div>

                            {/* Simulated Terminal (Right) */}
                            <div className="flex-1 font-mono text-[10px] text-gray-400 relative bg-black/20 text-left overflow-hidden">
                                {/* Glow Target */}
                                <div className="absolute inset-1 border-2 border-dashed rounded-lg animate-terminal-glow z-10"></div>

                                <img
                                    src="/opencode.jpg"
                                    className="w-full h-full object-cover opacity-60 grayscale-[20%]"
                                    alt="Terminal Preview"
                                />
                            </div>

                            {/* Hand Cursor */}
                            <div className="absolute top-[50px] left-[20px] z-30 text-white drop-shadow-lg animate-drag-cursor pointer-events-none">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-md">
                                    <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.6V2z" fill="white" stroke="black" strokeWidth="1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text */}
                    <div className="max-w-lg text-left">
                        <h2 className="text-3xl font-bold text-white mb-4">Opencode Ready</h2>
                        <div className="space-y-4">
                            <p className="text-neutral-300 text-lg leading-relaxed">
                                OpenCode is opensource terminal based AI coding assistant that helps you write code, debug errors, and understand your project structure directly from the terminal.
                            </p>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                You can use the file browser on the side to navigate your project. Simply drag and drop files or folders into the terminal to provide context to the AI.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 w-full flex flex-col gap-4">
                    <div className="w-120 mx-auto flex items-center gap-4">
                        {
                            isOpencodeInstalled ?
                                <button
                                    onClick={onStart}
                                    className="w-64 mx-auto items-center justify-center py-4 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-neutral-900  transform hover:-translate-y-1"
                                >
                                    <i className="fas fa-terminal mr-3"></i>
                                    Launch
                                </button>
                                :
                                <button
                                    onClick={onStart}
                                    className="w-64 mx-auto items-center justify-center py-4 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-neutral-900  transform hover:-translate-y-1"
                                >
                                    <i className="fas fa-terminal mr-3"></i>
                                    Launch
                                </button>
                        }
                    </div>

                    {/* 
                    <button
                        onClick={onStartManual}
                        className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-200 focus:outline-none underline decoration-neutral-700 hover:decoration-neutral-400"
                    >
                        Let me manually open OpenCode CLI
                    </button> */}
                </div>

                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-xs text-neutral-500">
                        Not all features are support in this app, please use
                        <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="mx-1 text-blue-400 hover:text-blue-300 transition-colors duration-200">
                            the terminal, web or desktop version
                        </a>
                        for the full experience.
                    </p>
                </div>
            </div>
        </div>
    )
}
