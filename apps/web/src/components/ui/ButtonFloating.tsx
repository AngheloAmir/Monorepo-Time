
const colorVariants = {
    default:        "from-blue-600/50 to-purple-600/50",
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
interface ButtonFloatingProps {
    onClick: () => void;
    top?:    number;
    right?:  number;
    bottom?: number;
    left?:   number;
    icon?:   string;
    text?:   string;
    color?: ColorVariant | (string & {});
    spanTo?: "toLeft" | "toRight" | "toTop" | "toBottom";
}

export default function ButtonFloating(props: ButtonFloatingProps) {
    const spanTo    = props.spanTo ?? "toLeft";

    // Resolve color: Check if it's a known variant, otherwise use as raw string, fallback to default
    const color = (colorVariants as Record<string, string>)[props.color as string] 
                    ?? props.color 
                    ?? colorVariants.default;

    const directionClasses = {
        toLeft: {
            btnFlex: "flex-row justify-end",
            contentFlex: "flex-row",
            // For toLeft/toRight, we animate width and left margin
            textAnim: "w-0 group-hover:w-auto ml-0 group-hover:ml-3",
        },
        toRight: {
            btnFlex: "flex-row justify-start",
            contentFlex: "flex-row",
            textAnim: "w-0 group-hover:w-auto ml-0 group-hover:ml-3",
        },
        toTop: {
            btnFlex: "flex-col justify-end",
            contentFlex: "flex-col",
            // For toTop/toBottom, we animate height and top margin
            textAnim: "h-0 group-hover:h-auto mt-0 group-hover:mt-3",
        },
        toBottom: {
            btnFlex: "flex-col justify-start",
            contentFlex: "flex-col",
            textAnim: "h-0 group-hover:h-auto mt-0 group-hover:mt-3",
        }
    };

    const dir = directionClasses[spanTo] || directionClasses.toLeft;
    return (
        <button
            onClick = {props.onClick}
            className ={`group fixed z-50 flex items-center ${dir.btnFlex}`}
            style={{
                top:   props.top,
                right: props.right,
                bottom: props.bottom,
                left: props.left,
            }}
        >
                <div className={`relative flex items-center ${dir.contentFlex} p-[1px] rounded-xl bg-gradient-to-r ${color} transition-transform duration-300 group-hover:scale-105`}>
                     <div className={`relative flex items-center ${dir.contentFlex} bg-[#0A0A0A] rounded-xl px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80`}>
                        <i className= { props.icon + " w-6 h-6 text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"}></i>
                         <span className={`font-bold overflow-hidden transition-all duration-300 whitespace-nowrap text-white ${dir.textAnim}`}>
                            { props.text }
                        </span>
                    </div>
                </div>
            </button >
    )
}
