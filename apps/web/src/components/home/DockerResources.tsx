import { useEffect } from "react";
import useDockerProcessInfoState from "../../_context/dockerprocessInfo"

export default function DockerResources() {
    const dockerprocessInfo = useDockerProcessInfoState.use.dockerprocessInfo();
    const loadDockerProcessInfo = useDockerProcessInfoState.use.loadDockerProcessInfo();

    useEffect(() => {
        setTimeout(() => {
            loadDockerProcessInfo();
        }, 5000);
    }, []);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <i className="fab fa-docker text-blue-400"></i>
                <div className="flex items-center gap-3">
                    <button id="docker-stop-all-btn" className="hidden text-xs px-2 py-0.5 rounded bg-red-900/30 hover:bg-red-800/50 text-red-400 hover:text-red-200 transition-colors border border-red-800/30" title="Stop All Containers">
                        <i className="fas fa-power-off"></i> Stop All
                    </button>
                    <span id="docker-mem-total" className="text-xs text-blue-400 font-mono"></span>
                    <span id="docker-count" className="text-xs text-gray-400 font-mono">-- Active</span>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar" id="docker-list-container">
                <div className="text-center text-xs text-gray-600 py-2">Waiting for data...</div>

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
                                <span className="text-[10px] font-medium">
                                    {c.status}
                                </span>
                            </div>
                            <button
                                className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors" title="Stop Container">
                                <i className="fas fa-power-off"></i>
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </>
    )
}