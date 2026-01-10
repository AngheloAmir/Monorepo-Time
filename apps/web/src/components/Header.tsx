

export default function Header() {
    return (
        <header className="h-12 w-full bg-gray-900/80 border-b border-gray-800 px-6 py-2">
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <i className="fas fa-boxes text-white text-lg"></i>
                </div>
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