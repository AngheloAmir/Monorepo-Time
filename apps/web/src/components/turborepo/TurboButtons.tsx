interface TurboButtonsProps {
    onCommand: (cmd: string) => void;
}

const commands = [
    { label: 'Install', cmd: 'npm install', icon: 'fa-download', color: 'from-blue-500 to-indigo-600' },
    { label: 'Build',   cmd: 'turbo build', icon: 'fa-hammer', color: 'from-emerald-500 to-teal-600' },
    { label: 'Lint',    cmd: 'turbo lint',  icon: 'fa-check-double', color: 'from-yellow-500 to-orange-600' },
    { label: 'Test',    cmd: 'turbo test',  icon: 'fa-vial', color: 'from-pink-500 to-rose-600' },
    { label: 'Clean',   cmd: 'turbo clean', icon: 'fa-broom', color: 'from-gray-500 to-gray-600' },
    { label: 'Summary', cmd: 'turbo run build --dry-run', icon: 'fa-list-alt' },
    { label: 'Prune',   cmd: 'turbo prune', icon: 'fa-scissors', color: 'from-red-500 to-red-600' },
    { label: 'Docker',  cmd: 'turbo prune --docker', icon: 'fa-docker', color: 'from-blue-400 to-blue-500' },
    { label: 'Remote',  cmd: 'npx turbo link',  icon: 'fa-cloud', color: 'from-cyan-500 to-blue-600' },
    { label: 'Cache',   cmd: 'rm -rf node_modules/.cache/turbo .turbo', icon: 'fa-trash-alt', color: 'from-red-600 to-red-700' },
];

export default function TurboButtons({ onCommand }: TurboButtonsProps) {
    return (
        <div className="h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <i className="fas fa-rocket text-white text-sm"></i>
                </div>
                <span>Turborepo.js</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {commands.map((c) => (
                    <button
                        key={c.label}
                        onClick={() => onCommand(c.cmd)}
                        className={`
                            relative group overflow-hidden p-3 rounded-lg border border-gray-800/60 bg-gray-800
                            hover:border-gray-700 hover:bg-gray-900 transition-all duration-300 text-left
                            hover:shadow-md hover:-translate-y-0.5
                        `}
                    >
                        {/* Hover Gradient Border Effect */}
                        <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${c.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                        
                        <div className="flex items-center gap-3">
                            <div className={`
                                w-8 h-8 rounded-md flex items-center justify-center shrink-0
                                bg-gradient-to-br ${c.color} text-white shadow-sm opacity-80 group-hover:opacity-100
                            `}>
                                <i className={`fas ${c.icon} text-xs`}></i>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                                    {c.label}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono truncate block w-full opacity-60 group-hover:opacity-100 transition-opacity">
                                    {c.cmd}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}