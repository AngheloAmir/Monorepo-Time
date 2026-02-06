import { borderColorVariants, type BorderColorVariant } from "./_color";

interface ButtonProps {
    name: string;
    description: string;
    color?: BorderColorVariant | (string & {});
    icon?: string;
    disabled?: boolean;
    isNotRendered?: boolean;
    render?: boolean;
    bg?: boolean;
    onClick: () => void;
}

export default function ButtonNeon(props: ButtonProps) {
    if (props.isNotRendered)
        return null;

    if (props.render != undefined) {
        if (props.render == false)
            return null;
    }

    return <Button2 {...props} />
}

function Button2(props: ButtonProps) {
    const defaultColor  = borderColorVariants.blueIndigo;
    const borderColor = 
        props.color && (borderColorVariants as Record<string, string>)[props.color] ? 
        (borderColorVariants as Record<string, string>)[props.color] : (props.color || defaultColor);
    
    return (
        <button
            key={props.name}
            disabled={props.disabled}
            onClick={props.disabled ? undefined : () => props.onClick()}
            className={`
                group relative w-full rounded p-[1px] transition-all duration-300
                ${props.disabled
                    ? 'opacity-70 cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
            `}
        >
            {/* Background Layer for Border (Hover - Colored) */}
            {!props.disabled && (
                <>
                    {/* Outer Glow - Adjusted for Firefox visibility */}
                    <div className={`absolute inset-0 rounded bg-gradient-to-r ${borderColor} opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500`} />
                    {/* Sharp Border Gradient */}
                    <div className={`absolute inset-0 rounded bg-gradient-to-r ${borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </>
            )}

            {/* Inner Content Container */}
            <div className={`
                relative h-full w-full rounded bg-[#0A0A0A]/80 p-2 flex items-center gap-3 overflow-hidden
                transition-colors duration-300
                ${!props.disabled && !props.bg ? 'group-hover:bg-[#212121]/70' : ''}
            `}>
                {/* Active Low-Opacity Background Overlay */}
                {props.bg && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${borderColor} opacity-20`} />
                )}

                {/* Icon Container */}
                <div className={`
                    relative z-10
                    w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                    bg-gradient-to-br ${borderColor} text-white shadow-lg
                    opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300
                `}>
                    <i className={`fas ${props.icon || 'fa-circle'} text-sm`}></i>
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col min-w-0 text-left">
                    <span className={`
                        font-bold text-sm truncate transition-colors duration-300
                        ${props.disabled ? 'text-gray-500' : (props.bg ? 'text-white' : 'text-gray-300 group-hover:text-white')}
                    `}
                    >
                        {props.name}
                    </span>
                    <span className={`
                        text-[12px] font-mono truncate block w-full transition-opacity duration-300
                        ${props.disabled ? 'text-gray-600' : (props.bg ? 'text-white/70' : 'text-gray-500 group-hover:text-gray-400')}
                    `} style={{ lineHeight: 1 }}>
                        {props.description}
                    </span>
                </div>
            </div>
        </button>
    )
}