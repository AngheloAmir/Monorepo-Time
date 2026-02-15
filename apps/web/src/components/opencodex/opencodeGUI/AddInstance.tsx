import Button3Mini from "../../ui/Button3Mini";
import useOpencode from "../../../appstates/opencode";
import useModal from "../../../modal/modals";


export default function AddInstance() {
    const isCreatingInstance = useOpencode.use.isCreatingInstance();
    const createInstance = useOpencode.use.createInstance();
    const showModal      = useModal.use.showModal();

    const handleCreateInstance = () => {
        if(isCreatingInstance) return;

        showModal(
            "prompt",
            "New Instance",
            "Enter the name of the new instance",
            "success",
            (value: string) => {
                createInstance( value );
            }
        )
    }

    return (
        <Button3Mini
            icon={isCreatingInstance ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-plus'}
            onClick={handleCreateInstance}
            title="New Terminal"
            className={`mx-2 px-2 opacity-50 hover:opacity-100 ${isCreatingInstance ? 'animate-pulse' : ''}`}
        />
    )
}