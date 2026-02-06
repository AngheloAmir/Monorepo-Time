export const borderColorVariants = {
    //blueIndigo:     'from-blue-500 to-indigo-600',
    blueIndigo:     'from-blue-400 to-blue-500',
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
