import InstancesTab      from "./InstancesTab";
import InstanceContainer from "./InstanceContainer";
import useOpencode       from "../../../appstates/opencode";
import AddInstance       from "./AddInstance";

export default function OpencodeGUI() {
    const opencodeInstances = useOpencode.use.opencodeInstances();
    
    return (
        <div className="w-full h-full">
            <div className="flex items-center">
                {opencodeInstances.map((instance) => (
                    <InstancesTab
                        key={instance.instance.id}
                        {...instance}
                    />
                ))}
                <AddInstance />
            </div>

            <div className="w-full h-full">
                {opencodeInstances.map((instance) => (
                    <InstanceContainer
                        key={instance.instance.id}
                        {...instance}
                    />
                ))}
            </div>
        </div>
    )
}
