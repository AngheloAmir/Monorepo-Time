export const borderColorVariants = {
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

export type BorderColorVariant = keyof typeof borderColorVariants;

        // <div className="relative rounded-xl p-[1px]  bg-gradient-to-r from-blue-600/40 to-purple-600/40">
        //     <div className="bg-[#1A1A1A] rounded-xl h-full flex flex-col overflow-hidden">
        //         <header className="p-3 flex items-start gap-4 bg-gradient-to-b from-white/5 to-transparent">
        //             <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
        //                 <i className={`${props.info.fontawesomeIcon ?? 'fa fa-cube'} text-gray-400 group-hover:text-blue-400 text-xl transition-colors`}></i>
        //             </div>
        //             <div className="flex flex-col h-12 overflow-hidden flex-1">
        //                 <h3 className="text-base font-bold text-gray-200 group-hover:text-white leading-tight mb-1 transition-colors">
        //                     {props.info.name}
        //                 </h3>
        //                 <p className="text-gray-500 group-hover:text-gray-400 text-xs truncate transition-colors">
        //                     {props.info.description}
        //                 </p>
        //             </div>
