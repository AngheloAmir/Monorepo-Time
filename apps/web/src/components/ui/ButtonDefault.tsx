export default function ButtonDefault(props: {
    onClick: () => void;
    text: string;
    icon?: string;
}) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                props.onClick();
            }}
            className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden"
        >
            <span className="relative z-10">{props.text}</span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
    )
}