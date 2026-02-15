import InstancesTab     from "./InstancesTab";
import OpencodeInstance from "./opencodeInstance";
import useOpencode from "../../../appstates/opencode";
import AddInstance from "./AddInstance";

export default function OpencodeGUI() {
    const opencodeInstances  = useOpencode.use.opencodeInstances();

    return (
        <div className="w-full h-full">
            <div className="flex items-center">
                {opencodeInstances.map((instance) => (
                    <InstancesTab
                        key={instance.instance.id}
                        instance={instance.instance}
                        isActive={instance.isActive}
                    />
                ))}
                <AddInstance />
            </div>

            <div className="w-full h-full">
                {opencodeInstances.map((instance) => (
                    <OpencodeInstance
                        key={instance.instance.id}
                        instance={instance.instance}
                        isVisible={instance.isActive}
                    />
                ))}
            </div>
        </div>
    )
}
