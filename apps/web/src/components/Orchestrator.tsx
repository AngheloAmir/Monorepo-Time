import ModalBody from "./ui/ModalBody";
import ModalHeader from "./ui/ModalHeader";
import useOrchestrator from "../appstates/orchestrator";

export default function Orchestrator() {
    const showOrchestrator    = useOrchestrator.use.showOrchestrator();
    const setShowOrchestrator = useOrchestrator.use.setShowOrchestrator();

    if(!showOrchestrator) return null;
    return (
        <ModalBody width="1000px">
            <ModalHeader
                title="Agent Orchestrator"
                description="Manage your agents, tasks, and workflows."
                close={() => { setShowOrchestrator(false) }}
            />
            <div className="flex h-[500px]" >
               
            </div>

        </ModalBody>
    );
}