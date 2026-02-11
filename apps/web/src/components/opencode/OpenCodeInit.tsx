import Button3 from "../ui/Button3"

export default function OpenCodeInitMessage({ isVisible, onInstall }: { isVisible: boolean, onInstall: () => void }) {
    return (
        <div className={`h-full w-full relative flex items-center justify-center p-4 overflow-hidden ${isVisible ? 'flex' : 'hidden'}`}>
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: "url('/opencode.jpg')" }}
            />

            <div className="relative z-10 max-w-md w-full bg-black/70 border border-white/10 rounded-xl p-8 text-center shadow-2xl">
                <a href="https://opencode.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 pr-2 block mb-6">
                    Visit opencode.ai for more information
                </a>

                <Button3 onClick={onInstall} text="">
                    <div className="flex flex-col items-center">
                        <span className="text-lg">Install OpenCode for Free</span>
                        <span className="text-xs font-normal opacity-75">npm i -g opencode-ai</span>
                    </div>
                </Button3>

            </div>
        </div>
    )
}
