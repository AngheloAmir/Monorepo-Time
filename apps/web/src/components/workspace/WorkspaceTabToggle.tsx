import useWorkspaceState from "../../appstates/workspace";

interface WorkspaceTabToggleProps {
    whichShow: string;
    setWhichShow: (whichShow: string) => void;
}

export function WorkspaceTabToggle(props: WorkspaceTabToggleProps) {
    const { whichShow, setWhichShow } = props;
    const workspaceDirs = useWorkspaceState.use.workspaceDirs();

    return (
        <div className="absolute top-2 left-2 z-20 bg-gradient-to-br from-blue-600/10 to-blue-400/10 px-2 rounded-lg">
            <button
                onClick={() => setWhichShow("all")}
                className={`${whichShow === "all" ? "bg-gradient-to-br from-blue-600 to-blue-400" : ""} px-4 py-1 text-xs font-bold uppercase rounded-lg transition-all text-white`}
            >
                Show All Apps
            </button>
            {workspaceDirs.map((dir) => (
                <button
                    key={dir}
                    onClick={() => setWhichShow(dir)}
                    className={`${whichShow === dir ? "bg-gradient-to-br from-blue-600 to-blue-400" : ""} px-4 py-1 text-xs font-bold uppercase rounded-lg transition-all text-white`}
                >
                    {dir}
                </button>
            ))}
        </div>
    );
}