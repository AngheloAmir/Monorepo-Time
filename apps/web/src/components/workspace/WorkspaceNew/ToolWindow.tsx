import InputField from "../../ui/InputField"
import ModalBody from "../../ui/ModalBody"
import ModalHeader from "../../ui/ModalHeader"

export default function ToolWindow(props: {
    template: string;
    setTemplate: (template: string) => void;
    setShowTemplateSelector: (showTemplateSelector: boolean) => void;
    close: () => void;
    createWorkspace: () => void;
}) {
    return (
        <ModalBody>
            <ModalHeader 
                close={props.close} 
                title="Add a Monorepo Tool"
                description="Add a tool and place it in opensource folder" />
            <div className="p-3 flex-1 overflow-y-auto text-md">
                <div className="flex flex-row w-full gap-6 px-5 mb-5">
                    <InputField
                        label="Tool Name"
                        icon="fas fa-cube"
                        placeholder=""
                        value={props.template}
                        onChange={(e) => {
                            props.setTemplate(e.target.value)
                        }}
                        disabled={true}
                    />
                    <button
                        onClick={() => props.setShowTemplateSelector(true)}
                        className="group relative h-10 mt-6  px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            Select
                        </span>
                    </button>
                </div>
            </div>

            <footer className="p-2 px-6 pb-4 flex justify-end gap-4">
                <button
                    onClick={props.close}
                    className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden"
                >
                    <span className="relative z-10">Cancel</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button
                    onClick={props.createWorkspace}
                    className="group relative px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        <i className="fas fa-plus"></i>
                        Add New Tool
                    </span>
                </button>
            </footer>
        </ModalBody>
    )
}