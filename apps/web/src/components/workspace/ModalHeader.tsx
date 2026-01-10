interface ModalHeaderProps {
    close: () => void;
    title: string;
    description: string;
    icon?: string;
}

export default function ModalHeader({ close, title, description, icon }: ModalHeaderProps) {
    return (
        <header className="px-4 py-2 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
            <div className="text-md font-bold text-white flex items-center gap-4">
                <i className={icon || "fas fa-cube text-blue-500 text-3xl"}></i>
                <div className="flex flex-col">
                    <span className="text-xl">
                        {title}
                    </span>
                    <span className="text-gray-400 font-normal text-sm truncate w-full text-xs">
                        {description}
                    </span>
                </div>
            </div>
            <button onClick={close} className="text-gray-400 hover:text-white transition-colors">
                <i className="fas fa-times text-lg"></i>
            </button>
        </header>
    );
}