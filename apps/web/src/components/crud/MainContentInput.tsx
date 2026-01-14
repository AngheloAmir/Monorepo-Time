import useCrudState from "../../_context/crud"
import { useState, useEffect } from "react";

export default function MainContentInput() {
    const params    = useCrudState.use.params();
    const setParams = useCrudState.use.setParams();
    const sendRequest = useCrudState.use.sendRequest();
    
    const executionTime = useCrudState.use.executionTime();
    const isFetching = useCrudState.use.isFetching();
    const requestStartTime = useCrudState.use.requestStartTime();

    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let animationFrameId: number;

        const updateTimer = () => {
            if (isFetching) {
                setElapsedTime(Date.now() - requestStartTime);
                animationFrameId = requestAnimationFrame(updateTimer);
            } else {
                setElapsedTime(executionTime);
            }
        };

        if (isFetching) {
            updateTimer();
        } else {
            setElapsedTime(executionTime);
        }

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isFetching, requestStartTime, executionTime]);

    return (
        <div className="flex flex-col gap-5 px-4">
            <div className="flex items-center gap-4">
                <button
                    className="group relative px-6 py-2 rounded-xl font-bold text-xs tracking-wide text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20 flex-none h-10 flex items-center gap-2"
                    onClick={sendRequest}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">
                        SEND REQUEST
                    </span>
                    <i className="fas fa-paper-plane relative z-10"></i>
                </button>

                <div className="flex-none bg-black/40 border border-white/5 rounded-xl px-4 h-10 flex items-center gap-3">
                    <span className="text-green-400 font-mono font-bold text-sm">
                        {elapsedTime} ms
                    </span>
                </div>

                <div className="group rounded-lg transition-all duration-300 w-full mr-4 lg:mr-12">
                <div className={`p-[1px] rounded-lg bg-gradient-to-r 
                    from-gray-700/40 to-gray-800/40 
                    group-focus-within:from-blue-500/40 
                    group-focus-within:to-purple-600/40
                    transition-colors duration-300`}>
                    <div className="bg-gray/[0.1] rounded flex items-center overflow-hidden">
                        <div className="pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-code-branch text-gray-500 group-focus-within:text-blue-400 transition-colors text-sm"></i>
                        </div>
                        <input
                            type="text"
                            className="pl-3 pr-4 py-2.5 text-sm w-full text-white placeholder-gray-600 focus:outline-none"
                            placeholder="Query Params (e.g. ?id=123)"
                            value={params}
                            onChange={(e) => {
                                setParams( e.target.value )
                            }}
                        />
                    </div>
                </div>
                </div>


            </div>
        </div>
    )
}
