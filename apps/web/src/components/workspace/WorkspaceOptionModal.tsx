import { useEffect, useState } from "react";
import useWorkspaceState from "../../_context/workspace";
import { type WorkspaceInfo } from "types";
import InputField from "../InputField";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";

export default function WorkspaceOptionModal() {
    const activeWorkspaceOptionModal = useWorkspaceState.use.activeWorkspaceOptionModal();
    const setActiveWorkspaceOptionModal = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const updateWorkspace = useWorkspaceState.use.updateWorkspace();
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo | null>(null);
    const [packageName, setPackageName] = useState<string>('');

    useEffect(() => {
        if (activeWorkspaceOptionModal) {
            setWorkspaceCopy(activeWorkspaceOptionModal);
            setPackageName(activeWorkspaceOptionModal.name);
        }
    }, [activeWorkspaceOptionModal]);

    function close() {
        setActiveWorkspaceOptionModal(null);
        setPackageName('.');
    }

    function save() {
        if (!workspaceCopy) return;
        if (!updateWorkspace(workspaceCopy)) return;
        close();
    }

    if (!activeWorkspaceOptionModal) return null;
    return (
        <ModalBody>
            <ModalHeader close={close} title={packageName} description={workspaceCopy?.path ?? ""} />

            <div className="p-3 flex-1 overflow-y-auto text-md">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {(
                        [
                            { pkg: "name", label: "Package Name", icon: "fas fa-cube", placeholder: "Workspace Name" },
                            { pkg: "fontawesomeIcon", label: "Icon", icon: "fas fa-icons", placeholder: "(optional) fontawesome icon" },
                        ] as Array<{ pkg: keyof WorkspaceInfo, label: string, icon: string, placeholder: string }>
                    ).map((item) => (
                        <InputField
                            key={item.pkg}
                            label={item.label}
                            icon={item.icon}
                            placeholder={item.placeholder}
                            value={workspaceCopy?.[item.pkg] || ''}
                            onChange={(e) => {
                                if (!workspaceCopy) return;
                                setWorkspaceCopy({
                                    ...workspaceCopy,
                                    [item.pkg]: e.target.value
                                })
                            }}
                        />
                    ))}
                </div>

                <InputField
                    key="description"
                    label="Description"
                    icon="fas fa-info"
                    placeholder="(optional) Description"
                    value={workspaceCopy?.description || ''}
                    onChange={(e) => {
                        if (!workspaceCopy) return;
                        setWorkspaceCopy({
                            ...workspaceCopy,
                            description: e.target.value
                        })
                    }}
                />

                <h4 className="my-4 w-full font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                    <p className="flex-1 text-sm">
                        <i className="fas fa-terminal mr-2"></i>
                        <span>Scripts & Commands</span>
                    </p>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                    {(
                        [
                            { pkg: "devCommand", label: "Dev Command", icon: "fas fa-code", placeholder: "ex: nodemon index.js" },
                            { pkg: "startCommand", label: "Start Command", icon: "fas fa-code", placeholder: "ex: node index.js" },
                            { pkg: "stopCommand", label: "Stop Command", icon: "fas fa-code", placeholder: "ex: npx -y kill-port 3000" },
                            { pkg: "buildCommand", label: "Build Command", icon: "fas fa-code", placeholder: "ex: tsc" },
                            { pkg: "cleanCommand", label: "Clean Command", icon: "fas fa-code", placeholder: "ex: rm -rf dist" },
                            { pkg: "lintCommand", label: "Lint Command", icon: "fas fa-code", placeholder: "ex: lint ." },
                            { pkg: "testCommand", label: "Test Command", icon: "fas fa-code", placeholder: "ex: jest" }
                        ] as Array<{ pkg: keyof WorkspaceInfo, label: string, icon: string, placeholder: string }>
                    ).map((item) => (
                        <InputField
                            key={item.pkg}
                            label={item.label}
                            icon={item.icon}
                            placeholder={item.placeholder}
                            value={workspaceCopy?.[item.pkg] || ''}
                            onChange={(e) => {
                                if (!workspaceCopy) return;
                                setWorkspaceCopy({
                                    ...workspaceCopy,
                                    [item.pkg]: e.target.value
                                })
                            }}
                        />
                    ))}
                </div>
            </div>

            <footer className="p-2 border-t border-gray-600 flex justify-end gap-4">
                <button onClick={close} className="w-32 bg-gray-700 hover:bg-gray-600 transition-colors p-1 rounded">Cancel</button>
                <button onClick={save} className="w-40 bg-blue-500 hover:bg-blue-600 transition-colors p-1 rounded">Save</button>
            </footer>
        </ModalBody>
    )
}
