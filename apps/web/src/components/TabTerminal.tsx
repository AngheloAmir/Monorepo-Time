import useWorkspaceState from "../_context/workspace";
import Console from "./Console";

export default function TabTerminal() {
    const workspace = useWorkspaceState.use.workspace();
    const activeTerminal = useWorkspaceState.use.activeTerminal();
    const setActiveTerminal = useWorkspaceState.use.setActiveTerminal();

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex-none w-full pt-1 flex bg-gray-800 min-h-6 flex-wrap gap-2 select-none">
                {workspace.map((item, index) => {
                    if (item.isRunningAs == 'dev' || item.isRunningAs == 'start')
                        return (
                            <div
                                key={index}
                                onClick={() => setActiveTerminal(item.info.name)}
                                className={`group px-2 w-[200px] gap-2 flex items-center ${activeTerminal === item.info.name ? 'bg-gray-800' : 'mb-1 opacity-60 cursor-pointer bg-gray-700 hover:bg-gray-600'}`}
                            >
                                <div className="flex-1 flex items-center gap-2 truncate overflow-hidden">
                                    <i className={`${item.info.fontawesomeIcon ?? 'fas fa-terminal'} text-[18px] flex-shrink-0`}></i>
                                    <span className="truncate font-medium text-[16px]">
                                        {item.info.name}
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTerminal('');
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            </div>

                        )
                    return null;
                })}
            </header>


            <div className="flex-1 overflow-y-auto bg-gray-900 p-2">
                {/* all workspace have active console but are made invisible */}
                {workspace.map((item) => (
                    <Console key={item.info.name} consoleOutput={item.consoleOutput} show={activeTerminal == item.info.name} />
                ))}
            </div>
        </div>
    );
}