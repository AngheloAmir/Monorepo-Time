import Logo from "./Logo";

export default function Header() {
    return (
        <header className="h-12 w-full bg-gray-900/80 border-b border-gray-800 px-6 py-2">
            <div className="flex items-center gap-4">
                <Logo className="w-8 h-8" />
                <div>
                    <h1 className="font-bold text-lg tracking-wide text-white">
                        Monorepo
                        <span className="pl-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Time
                        </span>
                    </h1>
                </div>
            </div>
        </header>
    )
}

// npx create-vite@latest . --template react-ts