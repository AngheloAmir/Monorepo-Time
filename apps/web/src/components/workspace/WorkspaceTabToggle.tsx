export function WorkspaceTabToggle({whichShow, setWhichShow}: {whichShow: string, setWhichShow: (whichShow: string) => void}) {
    return (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-b from-[#050505] to-[#101010] px-2 rounded-lg">
            <button
                onClick={() => setWhichShow("all")}
                className={`${whichShow === "all" ? "bg-blue-800/80" : ""} px-4 py-1 text-[10px] font-bold uppercase rounded-lg transition-all text-white/50`}
            >
                Show All Apps
            </button>
            <button
                onClick={() => setWhichShow("apps")}
                className={`${whichShow === "apps" ? "bg-blue-800/80" : ""} px-4 py-1 text-[10px] font-bold uppercase rounded-lg transition-all text-white/50`}
            >
                Apps Only
            </button>
            <button
                onClick={() => setWhichShow("tools")}
                className={`${whichShow === "tools" ? "bg-blue-800/80" : ""} px-4 py-1 text-[10px] font-bold uppercase rounded-lg transition-all text-white/50`}
            >
                Tools Only
            </button>
        </div>
    );
}