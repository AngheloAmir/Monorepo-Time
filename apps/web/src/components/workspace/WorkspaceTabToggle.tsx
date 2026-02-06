import useWorkspaceState from "../../appstates/workspace";

interface WorkspaceTabToggleProps {
    whichShow: string;
    setWhichShow: (whichShow: string) => void;
}

export function WorkspaceTabToggle(props: WorkspaceTabToggleProps) {
    const { whichShow, setWhichShow } = props;
    const workspaceDirs = useWorkspaceState.use.workspaceDirs();

    return (
        <div className="absolute top-2 left-2 z-20 bg-gradient-to-b from-[#050505] to-[#101010] px-2 rounded-lg">
            <button
                onClick={() => setWhichShow("all")}
                className={`${whichShow === "all" ? "bg-blue-800/80" : ""} px-4 py-1 text-[10px] font-bold uppercase rounded-lg transition-all text-white/50`}
            >
                Show All Apps
            </button>
            {workspaceDirs.map((dir) => (
                <button
                    onClick={() => setWhichShow(dir)}
                    className={`${whichShow === dir ? "bg-blue-800/80" : ""} px-4 py-1 text-[10px] font-bold uppercase rounded-lg transition-all text-white/50`}
                >
                    {dir}
                </button>
            ))}
        </div>
    );
}