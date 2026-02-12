const colorGroups = {
  Blue: ['bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-800', 'bg-blue-900'],
  Gray: ['bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900'],
  Green: ['bg-green-400', 'bg-green-500', 'bg-green-600'],
  Red: ['bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900'],
  Purple: ['bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-900'],
  Pink: ['bg-pink-400', 'bg-pink-500', 'bg-pink-600'],
  Orange: ['bg-orange-400', 'bg-orange-500', 'bg-orange-600'],
  Indigo: ['bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600'],
  Fuchsia: ['bg-fuchsia-500', 'bg-fuchsia-600'],
  Teal: ['bg-teal-500', 'bg-teal-600'],
  Yellow: ['bg-yellow-200', 'bg-yellow-500', 'bg-yellow-600'],
  Others: ['bg-amber-400', 'bg-cyan-500', 'bg-emerald-500', 'bg-lime-500', 'bg-rose-600'],
};

interface ColorPalletteProps {
    isVisible: boolean;
}

export default function ColorPallette(props: ColorPalletteProps) {
    if (!props.isVisible) return null;

    return (
        <div className="flex flex-col h-full w-full px-4 overflow-y-auto gap-8">
            <h1 className="text-2xl font-bold text-gray-200 mb-4">Color Palette Analysis</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Object.entries(colorGroups).map(([groupName, colors]) => (
                    <div key={groupName} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">{groupName}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {colors.map((color) => (
                                <ColorSwatch key={color} colorClass={color} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Browser Discrepancy Test (Blue-500)</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-32 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                        <span className="font-mono text-sm text-gray-400">bg-blue-500</span>
                    </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-32 rounded-xl bg-[oklch(0.60_0.20_250)] shadow-lg shadow-blue-500/50"></div>
                        <span className="font-mono text-sm text-gray-400">Direct OKLCH</span>
                    </div>
                </div>
                <p className="mt-4 text-center text-gray-400 text-sm max-w-2xl mx-auto">
                    If configured correctly with PostCSS and Tailwind, both squares above should look identical in modern browsers supporting OKLab. 
                    If the left square looks different (e.g. pinkish in Chrome without fix), the configuration might not be applying.
                </p>
            </div>
        </div>
    )
}

function ColorSwatch({ colorClass }: { colorClass: string }) {
    return (
        <div className="flex flex-col gap-2 group">
            <div className={`
                h-16 w-full rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105
                ${colorClass}
            `}></div>
            <div className="flex flex-col">
                <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors">
                    {colorClass}
                </span>
            </div>
        </div>
    )
}
