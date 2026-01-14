import Logo from "./Logo";

interface AboutModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AboutModal({ isOpen, setIsOpen }: AboutModalProps) {
    if (!isOpen) return null;

    return (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden scale-100 animate-scaleIn relative">
                <div className="p-8 flex flex-col items-center text-center">
                    
                    {/* App Logo/Icon */}
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1px] shadow-lg shadow-purple-500/20">
                        <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center overflow-hidden">
                             <Logo className="w-12 h-12" />
                        </div>
                    </div>

                    {/* Title & Version */}
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Monorepo 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Time</span>
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono mb-6">
                        v1.0.0
                    </span>

                    {/* Description */}
                    <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
                        The ultimate tool for managing your monorepos with speed and style. 
                        Streamline your workflow, visualize dependencies, and execute commands effortlessly.
                    </p>

                    {/* Footer / Links */}
                    {/* <div className="flex gap-4 text-sm">
                        <a href="https://github.com/AngheloAmir/Monorepo-Time" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <i className="fab fa-github"></i> Repository
                        </a>
                    </div> */}
                </div>
            </div>
            
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
}
