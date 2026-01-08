import { useEffect } from "react"
import useChildProcessInfoState from "../../_context/childprocessInfo";

export default function SystemResources() {
    const childprocessInfo = useChildProcessInfoState.use.childprocessInfo();
    const totalRam         = useChildProcessInfoState.use.totalRam();
    const peakRam          = useChildProcessInfoState.use.peakRam();
    const loadChildProcessInfo = useChildProcessInfoState.use.loadChildProcessInfo();

    useEffect(() => {
        const interval = setInterval(async () => {
            await loadChildProcessInfo();   
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <i className="fas fa-chart-line text-blue-500"></i> System Resources
                </h2>
                <div className="flex items-center gap-2">
                    <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-gray-400 font-mono">LIVE</span>
                </div>
            </div>

            {/* <!-- Key Metrics --> */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                    <div className="text-gray-400 text-[10px] uppercase">Current RAM</div>
                    <div className="text-xl font-bold text-white font-mono">
                        { totalRam } MB
                    </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                    <div className="text-gray-400 text-[10px] uppercase">Peak RAM</div>
                    <div className="text-xl font-bold text-pink-400 font-mono">
                        { peakRam } MB
                    </div>
                </div>
            </div>

            <div className="flex-none h-full overflow-hidden flex flex-col">
                <div className="text-xs text-gray-400 uppercase mb-2 font-bold tracking-wider flex justify-between">
                    Top Processes
                    <span className="text-xs text-gray-400 font-mono">
                        {childprocessInfo.length} Active
                    </span>
                </div>
                <div className="overflow-y-auto flex-1 space-y-1 pr-1 custom-scrollbar">
                    { childprocessInfo.length === 0 && (
                        <div className="text-center text-xs text-gray-600 py-2">Loading...</div>
                    )}
                    {childprocessInfo.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-1 rounded bg-gray-900/40 hover:bg-gray-800/60 border border-transparent hover:border-gray-700 transition-colors text-xs">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <i className="fas fa-boxes w-4 text-center"></i>
                                <span className="text-gray-300 font-mono truncate">
                                    {p.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 flex-none">
                                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-500">
                                    {p.pid}
                                </span>
                                <span className="font-mono text-white w-20 text-right">
                                    <span className="text-orange-500">
                                        {p.mem}
                                    </span> MB
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
