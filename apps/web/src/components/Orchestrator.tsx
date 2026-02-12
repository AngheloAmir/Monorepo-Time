import ModalBody from "./ui/ModalBody";
import ModalHeader from "./ui/ModalHeader";
import useOrchestrator from "../appstates/orchestrator";
import OpencodeAgents from "./orchestrator/OpencodeAgents";
import Button3 from "./ui/Button3";
import Workflow from "./orchestrator/Workflow";

export default function Orchestrator() {
    const showOrchestrator = useOrchestrator.use.showOrchestrator();
    const setShowOrchestrator = useOrchestrator.use.setShowOrchestrator();

    if (!showOrchestrator) return null;
    return (
        <ModalBody width="1000px">
            <ModalHeader
                close={() => setShowOrchestrator(false)}
                title="Agent Orchestrator"
                description="Design and execute multi-agent workflows." />
            <div className="flex h-[500px]">
                <div className="w-[250px] bg-red-500 flex-shrink-0">
                    <OpencodeAgents />
                </div>

                <div className="flex-1 bg-green-500 flex flex-col min-w-0">
                    <Workflow />
                </div>

            </div>

            <div className="flex justify-end">
                <Button3
                    onClick={() => setShowOrchestrator(false)}
                    text="Cancel"
                />
                <Button3
                    onClick={() => setShowOrchestrator(false)}
                    text="Run"
                />
            </div>
        </ModalBody>
    )
}
