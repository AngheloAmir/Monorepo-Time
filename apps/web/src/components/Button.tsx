const colorVariants = {
    blueIndigo:     'from-blue-500 to-indigo-600',
    emeraldTeal:    'from-emerald-500 to-teal-600',
    yellowOrange:   'from-yellow-500 to-orange-600',
    pinkRose:       'from-pink-500 to-rose-600',
    gray:           'from-gray-500 to-gray-600',
    red:            'from-red-500 to-red-600',
    skyBlue:        'from-blue-400 to-blue-500',
    cyanBlue:       'from-cyan-500 to-blue-600',
    darkRed:        'from-red-600 to-red-700',
    orangePurple:   'from-orange-500 to-purple-600',
    purplePink:     'from-purple-500 to-pink-500',
    indigoFuchsia:  'from-indigo-500 to-fuchsia-500',
    tealLime:       'from-teal-500 to-lime-500',
    bluePurple:     'from-blue-500 to-purple-600',
} as const;

export type ColorVariant = keyof typeof colorVariants;

interface ButtonProps {
    name: string;
    description: string;
    color?: ColorVariant | (string & {});
    icon?: string;
    disabled?: boolean;
    isNotRendered?: boolean;
    render?: boolean;
    bordered?: boolean;
    onClick: () => void;
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
    const defaultColor  = colorVariants.blueIndigo;
    const gradientColor = 
        props.color && (colorVariants as Record<string, string>)[props.color] ? 
        (colorVariants as Record<string, string>)[props.color] : (props.color || defaultColor);

    return (
        <button
            key={props.name}
            disabled={props.disabled}
            onClick={props.disabled ? undefined : () => props.onClick()}
            className={`
                group relative w-full rounded p-[1px] transition-all duration-300
                ${props.disabled
                    ? 'opacity-70 cursor-not-allowed grayscale'
                    : props.bordered
                        ? 'cursor-pointer'
                        : 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'}
            `}
        >
            {/* Background Layer for Border (Hover - Colored) */}
            {!props.disabled && (
                <>
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 rounded bg-gradient-to-r ${gradientColor} opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500`} />
                    {/* Sharp Border Gradient */}
                    <div className={`absolute inset-0 rounded bg-gradient-to-r ${gradientColor} ${props.bordered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} />
                </>
            )}

            {/* Inner Content Container */}
            <div className={`
                relative h-full w-full rounded bg-[#212121] p-2 flex items-center gap-3 overflow-hidden
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