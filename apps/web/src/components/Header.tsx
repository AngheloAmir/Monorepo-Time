import Logo from "./Logo";
import useAppState from "../appstates/app";

export default function Header() {
    const setShowAboutModal = useAppState.use.setShowAboutModal();

    return (
        <header className="h-12 w-full px-6 py-2 sticky top-0">
            <div className="flex items-center justify-between gap-4 h-full">
                <div className="flex items-center gap-4">
                    <Logo className="w-8 h-8" />
                    <div>
                        <h1 className="font-bold text-lg tracking-wide text-white">
                            Monorepo
                            <span className="pl-2 text-blue-400">
                                Time
                            </span>
                        </h1>
                    </div>
                </div>

                <button 
                    onClick={() => setShowAboutModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                >
                    <i className="fas fa-info-circle text-blue-400 group-hover:text-blue-300"></i>
                    <span>About</span>
                </button>
            </div>
        </header>
    )
}

// npx create-vite@latest . --template react-ts