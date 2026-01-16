import type { WorkspaceInfo } from "types";
import useWorkspaceState from "../../appstates/workspace";
import InputField from "../ui/InputField";
import SelectField from "../SelectField";
import { useEffect, useState } from "react";
import config from "config";
import apiRoute from "apiroute";
import ModalHeader from "../ui/ModalHeader";
import ModalBody from "../ui/ModalBody";

const clearInfo: WorkspaceInfo = {
    name: '', path: '', fontawesomeIcon: '', description: '', devCommand: '', startCommand: '', stopCommand: '', buildCommand: '', cleanCommand: '', lintCommand: '', testCommand: '',
}

export default function WorkspaceNew() {
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo>(clearInfo);
    const [paths, setpaths] = useState<(string | { label: string; path: string })[]>([]);
    const [error, setError] = useState('');
    const showWorkspaceNew = useWorkspaceState.use.showWorkspaceNew();
    const workspace = useWorkspaceState.use.workspace();
    const createNewWorkspace = useWorkspaceState.use.createNewWorkspace();
    const setShowWorkspaceNew = useWorkspaceState.use.setShowWorkspaceNew();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();

    useEffect(() => {
        if (showWorkspaceNew) {
            setWorkspaceCopy(clearInfo);
            const loadPaths = async () => {
                const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.listWorkspacesDir}`);
                const data = await response.json();
                setpaths(data);
            }
            loadPaths();
        }
    }, [showWorkspaceNew]);

    function close() {
        setError('');
        setShowWorkspaceNew(false);
    }

    async function createWorkspace() {
        if (workspaceCopy.name === '' || workspaceCopy.path === '') {
            setError('Package name and path is required');
            return;
        }

        const checkName = workspace.find((item) => item.info.name === workspaceCopy.name);
        if (checkName) {
            setError('Package name already exist');
            return;
        }

        const newWorkspaceToAdd: WorkspaceInfo = {
            name: workspaceCopy.name,
            path: workspaceCopy.path + "/" + workspaceCopy.name,
            devCommand: workspaceCopy.devCommand,
            fontawesomeIcon: workspaceCopy.fontawesomeIcon || undefined,
            description: workspaceCopy.description || undefined,
            startCommand: workspaceCopy.startCommand || undefined,
            stopCommand: workspaceCopy.stopCommand || undefined,
            buildCommand: workspaceCopy.buildCommand || undefined,
            cleanCommand: workspaceCopy.cleanCommand || undefined,
            lintCommand: workspaceCopy.lintCommand || undefined,
            testCommand: workspaceCopy.testCommand || undefined,
        };

        try {
            const response = await createNewWorkspace(newWorkspaceToAdd);
            if (response) {
                loadWorkspace();
                setShowNewTerminalWindow(newWorkspaceToAdd);
                close();
            }
        } catch (error) {
            setError('Failed to create workspace');
        }
    }

    if (!showWorkspaceNew) return null;
    return (
        <ModalBody>
            <ModalHeader close={close} title="New Workspace" description="Create a new workspace" />

            <div className="p-3 flex-1 overflow-y-auto text-md">
                {error &&
                    <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <InputField
                        label="Package Name"
                        icon="fa fa-cube"
                        placeholder="Package and Folder Name"
                        value={workspaceCopy?.name || ''}
                        onChange={(e) => {
                            if (!workspaceCopy) return;
                            setWorkspaceCopy({
                                ...workspaceCopy,
                                name: e.target.value
                            })
                        }}
                    />

                    <SelectField
                        label="Path"
                        icon="fas fa-folder"
                        placeholder="Select a workspace path"
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
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                    {(
                        [
                            { pkg: "fontawesomeIcon", label: "Icon", icon: "fas fa-icons", placeholder: "(optional) fontawesome icon" },
                            { pkg: "description", label: "Description", icon: "fas fa-info", placeholder: "(optional) description" },
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

            <footer className="p-2 px-6 flex justify-end gap-4">
                <button 
                    onClick={close} 
                    className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden"
                >
                    <span className="relative z-10">Cancel</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button 
                    onClick={createWorkspace} 
                    className="group relative px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        <i className="fas fa-plus"></i>
                        New Workspace
                    </span>
                </button>
            </footer>

        </ModalBody>
    )
}
