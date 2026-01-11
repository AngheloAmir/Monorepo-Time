interface ButtonProps {
    name: string;
    description: string;
    color?: string;
    icon?: string;
    disabled?: boolean;
    onClick: () => void
}

export default function Button(props: ButtonProps) {

    const mainClassName = `
        relative group p-3 rounded-lg border border-gray-800/60
        transition-all duration-300 text-left
        ${props.disabled 
            ? 'bg-gray-900/80 opacity-50 cursor-not-allowed border-transparent grayscale brightness-75' 
            : 'bg-gray-800 hover:border-gray-700 hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'}
    `;

    return (
        <button
            key={props.name}
            disabled={props.disabled}
            onClick={props.disabled ? undefined : () => props.onClick()}
            className={mainClassName}
        >
            {/* Hover Gradient Border Effect */}
            <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${props.color} scale-x-0 ${!props.disabled && 'group-hover:scale-x-100'} transition-transform duration-300 origin-left`} />

            <div className="flex items-center gap-3">
                <div className={`
                                w-8 h-8 rounded-md flex items-center justify-center shrink-0
                                bg-gradient-to-br ${props.color} text-white shadow-sm 
                                ${props.disabled ? 'opacity-40' : 'opacity-80 group-hover:opacity-100'}
                            `}>
                    <i className={`fas ${props.icon} text-xs`}></i>
                </div>
                <div className="flex flex-col min-w-0">
                    <span className={`font-medium text-sm transition-colors truncate ${props.disabled ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>
                        {props.name}
                    </span>
                    <span className={`text-[10px] text-gray-500 font-mono truncate block w-full transition-opacity ${props.disabled ? 'opacity-40' : 'opacity-60 group-hover:opacity-100'}`}>
                        {props.description}
                    </span>
                </div>
            </div>
        </button>
    )
}