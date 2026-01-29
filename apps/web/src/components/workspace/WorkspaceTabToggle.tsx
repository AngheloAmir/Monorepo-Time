export function WorkspaceTabToggle({whichShow, setWhichShow}: {whichShow: string, setWhichShow: (whichShow: string) => void}) {
    return (
        <div className="absolute top-2 left-2 z-10">
            <button
                onClick={() => setWhichShow("all")}
                className={`${whichShow === "all" ? "bg-gradient-to-r from-blue-600 to-blue-500" : ""} px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all text-white`}
            >
                All Apps
            </button>
            <button
                onClick={() => setWhichShow("apps")}
                className={`${whichShow === "apps" ? "bg-gradient-to-r from-blue-600 to-blue-500" : ""} px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all text-white`}
            >
                Apps Only
            </button>
            <button
                onClick={() => setWhichShow("tools")}
                className={`${whichShow === "tools" ? "bg-gradient-to-r from-blue-600 to-blue-500" : ""} px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all text-white`}
            >
                Tools Only
            </button>
        </div>
    );
}