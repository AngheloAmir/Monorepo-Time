
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
    top?:    string;
    right?:  string;
    bottom?: string;
    left?:   string;
    icon?:   string;
    text?:   string;
    color?: ColorVariant | (string & {});
}

export default function ButtonFloating(props: ButtonFloatingProps) {
    const Yposition = props.top   || props.bottom;
    const YPos      = props.top   ? `top-${Yposition}` : `bottom-${Yposition}`;
    const Xposition = props.right || props.left;
    const XPos      = props.right ? `right-${Xposition}` : `left-${Xposition}`;
    
    // Resolve color: Check if it's a known variant, otherwise use as raw string, fallback to default
    const color = (colorVariants as Record<string, string>)[props.color as string] 
                    ?? props.color 
                    ?? colorVariants.default;

    return (
        <button onClick = {props.onClick} className = {`group fixed ${YPos} ${XPos} z-50 flex items-center justify-end`}>
                <div className={`relative flex items-center p-[1px] rounded-xl bg-gradient-to-r ${color} transition-transform duration-300 group-hover:scale-105`}>
                     <div className="relative flex items-center bg-[#0A0A0A] rounded-xl px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80">
                        <i className= { props.icon + " w-6 h-6 text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"}></i>
                         <span className="font-bold ml-0 w-0 overflow-hidden group-hover:ml-3 group-hover:w-auto transition-all duration-300 whitespace-nowrap text-white">
                            { props.text }
                        </span>
                    </div>
                </div>
            </button >
    )
}

//this one set the bg:
// <div className="relative flex items-center p-[1px] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105">
// <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>