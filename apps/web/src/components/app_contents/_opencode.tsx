export function OpenCodeContent( {isVisible, onInstall}: {isVisible: boolean, onInstall: () => void}) {
    return(
        <div className={`h-[92%] w-full flex items-center justify-center p-4 ${isVisible ? 'flex' : 'hidden'}`}>
            <div className="max-w-md w-full bg-neutral-900/50 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-terminal text-3xl text-blue-400"></i>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">Install OpenCode AI</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    OpenCode AI is a powerful terminal assistant that helps you write code, debug issues, and manage your monorepo directly from the command line.
                </p>

                <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 pr-2">
                    Visit opencode.ai
                </a>
                for more information.

                <br />
                <br />

                <button
                    onClick={onInstall}
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-neutral-900"
                >
                    <div className="flex flex-col">
                        <h2 className="text-lg">Install OpenCode Globally</h2>
                        <p className="text-xs">
                            npm i -g opencode-ai
                        </p>
                    </div>
                </button>

                <p className="mt-4 text-xs text-neutral-500">
                    Disclaimer: This is not sponsored by opencode.ai,
                    it happens that they provide free access to their tool.
                </p>

                <p className="mt-4 text-xs text-neutral-500">
                    * My version of this tool is not full-supported,
                    but it is a good starting point. Ideally you should use the terminal version.
                </p>
            </div>
        </div>
    )
}

export function StartOpenCode({ isVisible, onStart }: { isVisible: boolean, onStart: () => void }) {
    return (
        <div className={`h-[92%] w-full flex items-center justify-center p-4 ${isVisible ? 'flex' : 'hidden'}`}>
            <div className="max-w-md w-full bg-neutral-900/50 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2">Opencode Ready</h2>
                <p className="text-neutral-400 mb-8 leading-relaxed">
                    Initialize your AI-powered terminal session to start coding, debugging, and managing your project.
                </p>

                <button
                    onClick={onStart}
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-neutral-900 w-full sm:w-auto"
                >
                    <i className="fas fa-terminal mr-2 group-hover:-translate-y-1 transition-transform duration-200"></i>
                    Launch Terminal
                </button>

                <p className="mt-4 text-xs text-neutral-500">
                    Not all features are support in this app, please use
                    <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="mx-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 pr-2">
                        the terminal, web or desktop version
                    </a>
                    for the full experience.
                </p>
            </div>
        </div>
    )
}
