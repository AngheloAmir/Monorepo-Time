import { useEffect, useState } from "react";
import useWorkspaceState from "../../_context/workspace";
import { type WorkspaceInfo } from "types";
import InputField from "../InputField";

export default function WorkspaceOptionModal() {
    const activeWorkspaceOptionModal        = useWorkspaceState.use.activeWorkspaceOptionModal();
    const setActiveWorkspaceOptionModal     = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo | null>(null);
    const [packageName, setPackageName]     = useState<string>('');
    
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

    if (!activeWorkspaceOptionModal) return null;
    return (
        <div onClick={close} className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/70">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 border border-gray-700 w-[80%] md:w-[50%] max-w-[600px] h-[80%] max-h-[650x] overflow-hidden flex flex-col">
                <header className="px-4 py-2 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                    <div className="text-md font-bold text-white flex items-center gap-4">
                        <i className="fas fa-cog text-blue-500 text-3xl"></i>

                        <div className="flex flex-col">
                            <span className="text-xl">
                                { packageName }
                            </span>
                            <span className="text-gray-400 font-normal text-sm truncate w-full text-xs">
                                {workspaceCopy?.path}
                            </span>
                        </div>
                    </div>
                    <button onClick={close} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </header>

                <div className="p-3 flex-1 overflow-y-auto text-md">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                    {(
                        [
                            {pkg: "name",            label: "Package Name",          icon: "fas fa-code", placeholder: "Workspace Name"},
                            {pkg: "fontawesomeIcon", label: "Icon",          icon: "fas fa-code", placeholder: "(optional) fontawesome icon"},
                        ] as Array<{pkg: keyof WorkspaceInfo, label: string, icon: string, placeholder: string}>
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
                            {pkg: "devCommand",      label: "Dev Command",   icon: "fas fa-code", placeholder: "ex: nodemon index.js"},
                            {pkg: "startCommand",    label: "Start Command", icon: "fas fa-code", placeholder: "ex: node index.js"},
                            {pkg: "stopCommand",     label: "Stop Command",  icon: "fas fa-code", placeholder: "ex: npx -y kill-port 3000"},
                            {pkg: "buildCommand",    label: "Build Command", icon: "fas fa-code", placeholder: "ex: tsc"},
                            {pkg: "cleanCommand",    label: "Clean Command", icon: "fas fa-code", placeholder: "ex: rm -rf dist"},
                            {pkg: "lintCommand",     label: "Lint Command",  icon: "fas fa-code", placeholder: "ex: lint ."},
                            {pkg: "testCommand",     label: "Test Command",  icon: "fas fa-code", placeholder: "ex: jest"}
                        ] as Array<{pkg: keyof WorkspaceInfo, label: string, icon: string, placeholder: string}>
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
                    <button onClick={close} className="w-40 bg-blue-500 hover:bg-blue-600 transition-colors p-1 rounded">Save</button>
                </footer>
            </div>
        </div>
    )
}
