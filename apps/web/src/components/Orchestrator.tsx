import ModalBody from "./ui/ModalBody";
import ModalHeader from "./ui/ModalHeader";
import useOrchestrator from "../appstates/orchestrator";

export default function Orchestrator() {
    const showOrchestrator = useOrchestrator.use.showOrchestrator();
    const setShowOrchestrator = useOrchestrator.use.setShowOrchestrator();

    if (!showOrchestrator) return null;
    return (
        <ModalBody>
            <ModalHeader
                close={() => setShowOrchestrator(false)}
                title="Agent Orchestrator"
                description="Design and execute multi-agent workflows." />
            <div className="p-3 flex-1 overflow-y-auto text-md">

            </div>
        </ModalBody>
    )
}
