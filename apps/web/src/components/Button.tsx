interface ButtonProps {
    name: string;
    description: string;
    color?: string;
    icon?: string;
    disabled?: boolean;
    onClick: () => void
}

export default function Button(props: ButtonProps) {
    const defaultColor = 'from-blue-500 to-purple-600';
    const gradientColor = props.color || defaultColor;

    return (
        <button
            key={props.name}
            disabled={props.disabled}
            onClick={props.disabled ? undefined : () => props.onClick()}
            className={`
                group relative w-full rounded p-[1px] transition-all duration-300
                ${props.disabled 
                    ? 'opacity-50 cursor-not-allowed grayscale' 
                    : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
            `}
        >
            {/* Background Layer for Border (Default) */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 transition-opacity duration-300" />

            {/* Background Layer for Border (Hover - Colored) */}
            {!props.disabled && (
                <>
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500`} />
                    {/* Sharp Border Gradient */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </>
            )}

            {/* Inner Content Container */}
            <div className={`
                relative h-full w-full rounded-[10px] bg-[#0A0A0A] p-3 flex items-center gap-3 overflow-hidden
                transition-colors duration-300
                ${!props.disabled ? 'group-hover:bg-[#0A0A0A]/90' : ''}
            `}>
                {/* Icon Container */}
                <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                    bg-gradient-to-br ${gradientColor} text-white shadow-lg
                    ${props.disabled ? 'opacity-40' : 'opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300'}
                `}>
                    <i className={`fas ${props.icon || 'fa-circle'} text-sm drop-shadow-md`}></i>
                </div>

                {/* Text Content */}
                <div className="flex flex-col min-w-0 text-left">
                    <span className={`
                        font-bold text-sm truncate transition-colors duration-300
                        ${props.disabled ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}
                    `}>
                        {props.name}
                    </span>
                    <span className={`
                        text-[10px] font-mono truncate block w-full transition-opacity duration-300
                        ${props.disabled ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-400'}
                    `}>
                        {props.description}
                    </span>
                </div>
            </div>
        </button>
    )
}