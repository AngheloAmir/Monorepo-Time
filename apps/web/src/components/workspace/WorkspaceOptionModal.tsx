import { useEffect, useState } from "react";
import useWorkspaceState from "../../_context/workspace";
import { type WorkspaceInfo } from "types";

export default function WorkspaceOptionModal() {
    const activeWorkspaceOptionModal        = useWorkspaceState.use.activeWorkspaceOptionModal();
    const setActiveWorkspaceOptionModal     = useWorkspaceState.use.setActiveWorkspaceOptionModal();
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo | null>(null);
    
    useEffect(() => {
        if (activeWorkspaceOptionModal) {
            setWorkspaceCopy(activeWorkspaceOptionModal);
        }
    }, [activeWorkspaceOptionModal]);

    function close() {
        setActiveWorkspaceOptionModal(null);
    }

    if (!activeWorkspaceOptionModal) return null;
    return (
        <div onClick={close} className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/70">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 border border-gray-700 w-[80%] md:w-[50%] max-w-[600px] h-[90%] md:h-[70%] max-h-[800px] overflow-hidden flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                        <i className="fas fa-cog text-blue-500"></i>
                        Workspace <span className="text-blue-500">{workspaceCopy?.name}</span>
                    </h3>
                    <button onClick={close} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </header>

                <div className="p-2 flex-1 overflow-y-auto text-md">
                    <div className="flex flex-row gap-2 p-1">
                        <label className="text-gray-400 w-24 flex gap-2">
                            <i className="w-6 fas fa-folder text-blue-500 text-xl"></i>
                            Path
                        </label>
                        <p className="text-sm"> { workspaceCopy?.path } </p>
                    </div>
                    
                    {(
                        [
                            {pkg: "description",     label: "Description",   icon: "fas fa-info", placeholder: "(optional) Description"},
                            {pkg: "fontawesomeIcon", label: "Icon",          icon: "fas fa-code", placeholder: "(optional) fontawesome icon"},
                            {pkg: "localUrl",        label: "URL",           icon: "fas fa-globe", placeholder: "(optional) URL"},
                            {pkg: "prodUrl",         label: "Prod",          icon: "fas fa-globe", placeholder: "(optional) Prod"},
                            {pkg: "devCommand",      label: "Dev Command",   icon: "fas fa-code", placeholder: "ex: nodemon index.js"},
                            {pkg: "startCommand",    label: "Start Command", icon: "fas fa-code", placeholder: "ex: node index.js"},
                            {pkg: "stopCommand",     label: "Stop Command",  icon: "fas fa-code", placeholder: "ex: npx -y kill-port 3000"},
                            {pkg: "buildCommand",    label: "Build Command", icon: "fas fa-code", placeholder: "ex: tsc"},
                            {pkg: "cleanCommand",    label: "Clean Command", icon: "fas fa-code", placeholder: "ex: rm -rf dist"},
                            {pkg: "lintCommand",     label: "Lint Command",  icon: "fas fa-code", placeholder: "ex: lint ."},
                            {pkg: "testCommand",     label: "Test Command",  icon: "fas fa-code", placeholder: "ex: jest"}
                        ] as Array<{pkg: keyof WorkspaceInfo, label: string, icon: string, placeholder: string}>
                    ).map((item) => (
                        <div className="flex flex-row gap-2 p-1" key={item.pkg}>
                            <label className="text-gray-400 w-24 flex gap-2">
                                <i className={`w-6 ${item.icon} text-blue-500 text-xl`}></i>
                                {item.label}
                            </label>
                            <input
                                type="text"
                                className="bg-gray-900 border border-gray-600 rounded p-1 text-white flex-1"
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
                        </div>
                    ))}
                </div>

                <footer className="p-2 border-t border-gray-600 flex justify-end gap-2">
                    <button onClick={close} className="bg-gray-700 hover:bg-gray-600 transition-colors p-2 rounded">Cancel</button>
                    <button onClick={close} className="bg-blue-500 hover:bg-blue-600 transition-colors p-2 rounded">Save</button>
                </footer>
            </div>
        </div>
    )
}