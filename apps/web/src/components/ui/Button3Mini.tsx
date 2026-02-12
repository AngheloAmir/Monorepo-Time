export default function Button3Mini({ icon, onClick, title, className }: { icon: string, onClick: () => void, title: string, className?: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-6 h-6 bg-gradient-to-br from-blue-600/50 to-blue-400/50 rounded flex items-center justify-center text-white ${className}`}
            title={title}
        >
            <i className={icon}></i>
        </button>
    )
}