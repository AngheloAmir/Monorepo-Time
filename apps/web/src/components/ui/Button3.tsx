interface Button3Props {
    onClick: () => void;
    text: string;
    icon?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function Button3(props: Button3Props) {
    return (
        <button
            onClick={props.onClick}
            className={"group relative px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]" + (props.className ? " " + props.className : "")}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
            <span className="relative z-10 flex items-center gap-2">
                {props.icon && <i className={props.icon}></i>}
                {props.text}
                {props.children}
            </span>
        </button>
    )
}