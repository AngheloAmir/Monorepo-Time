import type { OpencodeGUIInstance } from "../../../appstates/opencode";
import useOpencode from "../../../appstates/opencode";
import useModal from "../../../modal/modals";


export default function InstancesTab(props: OpencodeGUIInstance) {
    const opencodeInstances = useOpencode.use.opencodeInstances();
    const setInstanceActive = useOpencode.use.setInstanceActive();
    const closeInstance     = useOpencode.use.closeInstance();
    const showModal         = useModal.use.showModal();

    function handleCloseInstance(e: React.MouseEvent) {
        e.stopPropagation();
        showModal(
            "confirm",
            "Close this Opencode?",
            `Are you sure you want to close ${props.instance.name}?`,
            "warning",
            (result :any) => {
                if (result) {
                    closeInstance(props.instance.id);
                }
            },
        )
    }

    return (
        <div className="flex items-center">
            <div
                onClick={() => setInstanceActive(props.instance.id)}
                className={`
                        group relative flex items-center justify-between rounded-t-md w-36 px-2 py-0.3
                        cursor-pointer transition-all duration-300 select-none
                        border-r border-white/5
                        ${props.isActive ?
                        'bg-gradient-to-br from-blue-600/40 to-blue-400/40 text-white' :
                        'bg-[#0b0b0b] text-gray-500 hover:bg-[#121212] hover:text-gray-300'
                    }
            `}
            >
                <span className="truncate text-sm flex-1">
                    {props.instance.name}
                </span>

                {opencodeInstances.length > 1 ? (
                    <button
                        onClick={handleCloseInstance}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-0.5 rounded"
                    >
                        <i className="fa-solid fa-times text-xs"></i>
                    </button>
                ) : (
                    <div className="opacity-0 p-0.5">
                        <i className="fa-solid fa-times text-xs"></i>
                    </div>
                )}
            </div>
        </div>
    );
}
