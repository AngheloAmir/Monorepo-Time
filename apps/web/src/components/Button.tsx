interface ButtonProps {
    name: string;
    description: string;
    color?: string;
    icon?: string;
    disabled?: boolean;
    isNotRendered?: boolean;
    render?: boolean;
    onClick: () => void
}

export default function Button(props: ButtonProps) {
    if (props.isNotRendered)
        return null;

    if (props.render != undefined) {
        if (props.render == false)
            return null;
    }

    return <ButtonSkeleton {...props} />
}


function ButtonSkeleton(props: ButtonProps) {
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
                    ? 'opacity-70 cursor-not-allowed grayscale'
                    : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
            `}
        >
            {/* Background Layer for Border (Hover - Colored) */}
            {!props.disabled && (
                <>
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 rounded bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500`} />
                    {/* Sharp Border Gradient */}
                    <div className={`absolute inset-0 rounded bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </>
            )}

            {/* Inner Content Container */}
            <div className={`
                relative h-full w-full rounded-[10px] bg-[#212121] p-2 flex items-center gap-3 overflow-hidden
                transition-colors duration-300
                ${!props.disabled ? 'group-hover:bg-[#212121]/70' : ''}
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
                        font-bold text-md truncate transition-colors duration-300
                        ${props.disabled ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}
                    `}
                    >
                        {props.name}
                    </span>
                    <span className={`
                        text-[12px] font-mono truncate block w-full transition-opacity duration-300
                        ${props.disabled ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-400'}
                    `} style={{ lineHeight: 1 }}>
                        {props.description}
                    </span>
                </div>
            </div>
        </button>
    )
}