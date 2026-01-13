import { useEffect, useState } from "react";
import useWorkspaceState from "../../_context/workspace";
import { type WorkspaceInfo } from "types";
import InputField from "../ui/InputField";
import ModalHeader from "../ui/ModalHeader";
import ModalBody from "../ui/ModalBody";

export default function WorkspaceOptionModal() {
    const activeWorkspaceOptionModal = useWorkspaceState.use.activeWorkspaceOptionModal();
    const setActiveWorkspaceOptionModal = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const updateWorkspace = useWorkspaceState.use.updateWorkspace();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo | null>(null);
    const [packageName, setPackageName] = useState<string>('');
    const [error, setError] = useState<string>('');

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

    async function save() {
        if (!workspaceCopy) return;
        if (workspaceCopy.name.length < 1) {
            setError('Package name cannot be empty');
            return;
        }
        const updateSuccess = await updateWorkspace(workspaceCopy);
        if (!updateSuccess) {
            setError('Failed to update workspace');
            return;
        }
        await loadWorkspace();
        close();
    }

    if (!activeWorkspaceOptionModal) return null;
    return (
        <ModalBody>
            <ModalHeader close={close} title={packageName} description={workspaceCopy?.path ?? ""} />
            <div className="p-4 flex-1 overflow-y-auto text-md">
                {error && <p className="text-red-500 mb-2">{error}</p>}
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

            <footer className="p-2 px-6 flex justify-end gap-4">
                <button 
                    onClick={close} 
                    className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden"
                >
                    <span className="relative z-10">Cancel</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button 
                    onClick={save} 
                    className="group relative px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        <i className="fas fa-save"></i>
                        Save
                    </span>
                </button>
            </footer>
        </ModalBody>
    )
}
