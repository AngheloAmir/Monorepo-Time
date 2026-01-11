interface ModalHeaderProps {
    close: () => void;
    title: string;
    description: string;
    icon?: string;
}

export default function ModalHeader({ close, title, description, icon }: ModalHeaderProps) {
    return (
        <header className="px-3 py-1 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="text-md font-bold text-white flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <i className={icon || "fas fa-cube text-white text-lg"}></i>
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {title}
                    </span>
                    <span className="text-gray-500 font-medium text-xs tracking-wide uppercase">
                        {description}
                    </span>
                </div>
            </div>
            <button onClick={close} className="w-8 h-8 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center">
                <i className="fas fa-times text-sm"></i>
            </button>
        </header>
    );
}