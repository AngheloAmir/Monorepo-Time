import type { WorkspaceInfo } from "types";
import useWorkspaceState from "../../_context/workspace";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { useEffect, useState } from "react";
import config from "config";
import apiRoute from "apiroute";

export default function WorkspaceNew() {
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo>(
        {
            name: '',
            path: '',
            fontawesomeIcon: '',
            description: '',
            devCommand: '',
            startCommand: '',
            stopCommand: '',
            buildCommand: '',
            cleanCommand: '',
            lintCommand: '',
            testCommand: '',
        }
    );
    const [paths, setpaths]   = useState<(string | { label: string; path: string })[]>([]);
    const showWorkspaceNew    = useWorkspaceState.use.showWorkspaceNew();
    const setShowWorkspaceNew = useWorkspaceState.use.setShowWorkspaceNew();
    const loadWorkspace       = useWorkspaceState.use.loadWorkspace();

    useEffect(() => {
        if (showWorkspaceNew) {
            setWorkspaceCopy(
                {
                    name: '',
                    path: '',
                    fontawesomeIcon: '',
                    description: '',
                    devCommand: '',
                    startCommand: '',
                    stopCommand: '',
                    buildCommand: '',
                    cleanCommand: '',
                    lintCommand: '',
                    testCommand: '',
                }
            );
            const loadPaths = async () => {
                const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.listWorkspacesDir}`);
                const data = await response.json();
                setpaths(data);
            }
            loadPaths();
        }
    }, [showWorkspaceNew]);

    function close() {
        setShowWorkspaceNew(false);
    }

    async function createWorkspace() {
        if(workspaceCopy.name === '') return;
        if(workspaceCopy.path === '') return;
        const workspace = {
            name:            workspaceCopy.name,
            path:            workspaceCopy.path,
            devCommand:      workspaceCopy.devCommand,
            fontawesomeIcon: workspaceCopy.fontawesomeIcon || null,
            description:     workspaceCopy.description     || null,
            startCommand:    workspaceCopy.startCommand    || null,
            stopCommand:     workspaceCopy.stopCommand     || null,
            buildCommand:    workspaceCopy.buildCommand    || null,
            cleanCommand:    workspaceCopy.cleanCommand    || null,
            lintCommand:     workspaceCopy.lintCommand     || null,
            testCommand:     workspaceCopy.testCommand     || null,
        };

        try {
            const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.newWorkspace}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workspace),
            });
            const data = await response.json();
            console.log(data);
            loadWorkspace();
        } catch (error) {
            console.error(error);
        }   
    }



    if (!showWorkspaceNew) return null;
    return (
        <div onClick={close} className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/70">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 border border-gray-700 w-[80%] md:w-[50%] max-w-[600px] h-[80%] max-h-[650x] overflow-hidden flex flex-col">
                <header className="px-4 py-2 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                    <div className="text-md font-bold text-white flex items-center gap-4">
                        <i className="fas fa-cube text-blue-500 text-3xl"></i>
                        <div className="flex flex-col">
                            <span className="text-xl">
                                New Workspace
                            </span>
                            <span className="text-gray-400 font-normal text-sm truncate w-full text-xs">
                                Create a new workspace
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

                    <SelectField
                        label="Path"
                        icon="fas fa-folder"
                        placeholder="Select a path"
                        value={workspaceCopy?.path || ''}
                        onChange={(e) => {
                            if (!workspaceCopy) return;
                            setWorkspaceCopy({
                                ...workspaceCopy,
                                path: e.target.value
                            })
                        }}
                        options={paths}
                    /> 

                    <div className="mt-4 grid grid-cols-2 gap-2">
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
                    <button onClick={createWorkspace} className="w-40 bg-blue-500 hover:bg-blue-600 transition-colors p-1 rounded">New Workspace</button>
                </footer>
            </div>
        </div>
    )
}
