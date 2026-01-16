import { useEffect } from "react";
import useDockerProcessInfoState from "../../appstates/dockerprocessInfo"

export default function DockerResources() {
    const dockerprocessInfo       = useDockerProcessInfoState.use.dockerprocessInfo();
    const loadDockerProcessInfo   = useDockerProcessInfoState.use.loadDockerProcessInfo();
    const stopDockerContainer     = useDockerProcessInfoState.use.stopDockerContainer();
    const stopAllDockerContainers = useDockerProcessInfoState.use.stopAllDockerContainers();

    useEffect(() => {
        loadDockerProcessInfo();
        const interval = setInterval(() => {
            loadDockerProcessInfo();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Calculate total RAM for display in component
    const totalRamBytes = dockerprocessInfo.reduce((acc, c) => acc + (c.memoryBytes || 0), 0);
    const totalRamMB = Math.round(totalRamBytes / 1024 / 1024);

    return (
        <div className="h-[420px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-none">
                <i className="fab fa-docker text-blue-400"></i>
                <div className="flex items-center gap-3">
                    {dockerprocessInfo.length > 0 && (
                        <button 
                            id="docker-stop-all-btn" 
                            onClick={() => stopAllDockerContainers()}
                            className="text-xs px-2 py-0.5 rounded bg-red-900/30 hover:bg-red-800/50 text-red-400 hover:text-red-200 transition-colors border border-red-800/30" 
                            title="Stop All Containers">
                            <i className="fas fa-power-off"></i> Stop All
                        </button>
                    )}
                    <span id="docker-mem-total" className="text-xs text-blue-400 font-mono"></span>
                    <span id="docker-count" className="text-xs text-gray-400 font-mono">
                         Total RAM: {totalRamMB} MB ({dockerprocessInfo.length} active)
                    </span>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar" id="docker-list-container">
                {dockerprocessInfo.length === 0 && (
                    <div className="text-center text-xs text-gray-600 py-2">No active containers</div>
                )}

                { dockerprocessInfo.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-900/40 border border-gray-700/30 text-xs">
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                            <div className="flex items-center gap-2">
                                <i className="fab fa-docker text-blue-500"></i>
                                <span className="text-gray-200 font-bold truncate" title={c.name}>
                                    {c.name}
                                </span>
                            </div>
                            <span className="text-gray-500 text-[10px] truncate" title={c.image}>
                                {c.image}
                             </span>
                        </div>
                        <div className="flex items-center gap-3 flex-none ml-2">
                            <div className="flex flex-col items-end gap-0.5">
                                <span className="text-[10px] text-gray-400 font-mono">
                                    {c.memoryStr}
                                </span>
                                <span className={`text-[10px] font-medium ${c.status.startsWith('Up') ? 'text-green-400' : 'text-gray-400'}`}>
                                    {c.status}
                                </span>
                            </div>
                            <button
                                onClick={() => stopDockerContainer(c.id)}
                                className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors" title="Stop Container">
                                <i className="fas fa-power-off"></i>
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}