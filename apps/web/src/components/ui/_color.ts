export const borderColorVariants = {
    blueIndigo:     'bg-blue-600',
    emeraldTeal:    'bg-emerald-600',
    yellowOrange:   'bg-orange-500',
    pinkRose:       'bg-rose-600',
    gray:           'bg-gray-600',
    red:            'bg-red-600',
    skyBlue:        'bg-sky-500',
    cyanBlue:       'bg-cyan-600',
    darkRed:        'bg-red-700',
    orangePurple:   'bg-violet-600',
    purplePink:     'bg-purple-600',
    indigoFuchsia:  'bg-fuchsia-600',
    tealLime:       'bg-teal-500',
    bluePurple:     'bg-indigo-600',
} as const;

export type BorderColorVariant = keyof typeof borderColorVariants;
