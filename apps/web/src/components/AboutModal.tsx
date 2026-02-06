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
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-blue-600 p-[1px] shadow-lg shadow-blue-500/20">
                        <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center overflow-hidden">
                             <Logo className="w-12 h-12" />
                        </div>
                    </div>

                    {/* Title & Version */}
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Monorepo 
                        <span className="text-blue-400"> Time</span>
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
                        The ultimate tool for managing your monorepos with speed and style. 
                        Streamline your workflow, visualize dependencies, and execute commands effortlessly.
                    </p>

                    {/** Buy me a coffe */}
                    <a 
                        href="https://buymeacoffee.com/angheloamir" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#FFDD00] text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,221,0,0.4)] hover:bg-[#ffe233]"
                    >
                        <i className="fas fa-coffee text-xl transition-transform duration-300 group-hover:rotate-12"></i> 
                        <span className="relative">Buy me a coffee</span>
                    </a>
                </div>
            </div>
            
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
}
