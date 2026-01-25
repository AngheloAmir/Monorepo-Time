
export default function Header() {
    return (
        <div className="w-full h-12">
            <div className="container px-4 max-w-7xl mx-auto h-full flex items-center gap-3">
                <img src="/logo.svg" alt="MonoChat Logo" className="w-8 h-8" />
                <h1 className="font-bold text-lg tracking-wide text-white">
                    MonoChat
                </h1>
            </div>
        </div>
    )
}