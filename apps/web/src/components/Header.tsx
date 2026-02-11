import useAppState from "../appstates/app";
import Logo from "./Logo";

export default function Header() {
    const setShowAboutModal = useAppState.use.setShowAboutModal();
    const setShowGit = useAppState.use.setShowGit();

    return (
        <header className="h-12 w-full px-6 py-2 sticky top-0">
            <div className="flex items-center justify-between gap-4 h-full">
                <div className="flex items-center gap-2">
                    <Logo />
                    <div>
                        <h1 className="text-xl font-space tracking-tight text-white font-medium">
                            Monorepo
                            <span className="font-bold pl-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                                Time
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowGit(true)}
                        className="flex items-center gap-2 py-1 px-2 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    >
                        <i className="text-2xl fa-brands fa-git-alt text-blue-400 group-hover:text-blue-300"></i>
                        <span className="text-sm">Press 
                            <span className="font-bold text-white"> Ctrl + S </span> 
                            or 
                            <span className="font-bold text-white"> Ctrl + X </span> 
                            to open Git Panel
                        </span>
                    </button>

                    <button
                        onClick={() => setShowAboutModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all group"
                    >
                        <i className="fas fa-info-circle text-blue-400 group-hover:text-blue-300"></i>
                        <span>About</span>
                    </button>
                </div>

            </div>
        </header>
    )
}
