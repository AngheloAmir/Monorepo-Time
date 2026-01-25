import type { WorkspaceInfo } from "types";
import useWorkspaceState from "../../appstates/workspace";
import InputField from "../ui/InputField";
import SelectField from "../SelectField";
import { useEffect, useState } from "react";

import ModalHeader from "../ui/ModalHeader";
import ModalBody from "../ui/ModalBody";
import TemplateSelector from "./TemplateSelector";

const clearInfo: WorkspaceInfo = {
    name: '',
    path: '',
    fontawesomeIcon: '',
    description: '',
    devCommand: ''
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
    const listWorkspaceDir = useWorkspaceState.use.listWorkspace();
    const setWorkspaceTemplate = useWorkspaceState.use.setWorkspaceTemplate();
    const setWorkspaceLoading = useWorkspaceState.use.setWorkspaceLoading();

    const [template, setTemplate] = useState('');
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);

    useEffect(() => {
        if (showWorkspaceNew) {
            setWorkspaceCopy(clearInfo);
            const loadPaths = async () => {
                const data = await listWorkspaceDir();
                setpaths(data);
            }
            loadPaths();
        }
        else {
            setTemplate('');
        }
    }, [showWorkspaceNew]);

    function close() {
        setError('');
        setShowWorkspaceNew(false);
    }

    //============================================================================================
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
        };

        try {
            setWorkspaceLoading(true);
            close();
            const response = await createNewWorkspace(newWorkspaceToAdd);
            if (response) {
                if (template)
                    await setWorkspaceTemplate(newWorkspaceToAdd, template);
                else {
                    setWorkspaceLoading(false);
                    setShowNewTerminalWindow(newWorkspaceToAdd);
                }
            }
        } catch (error) {
            if (window.isLoadingCancelled) return;
            setError('Failed to create workspace');
        }
        loadWorkspace();
        setWorkspaceLoading(false);
    }

    //============================================================================================
    if (!showWorkspaceNew) return null;
    return (
        <ModalBody>
            <ModalHeader close={close} title="New Workspace" description="Create a new workspace" />

            <div className="p-3 flex-1 overflow-y-auto text-md">
                {error &&
                    <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <InputField
                        label="Name (small letters)"
                        icon="fa fa-cube"
                        placeholder="Package and Folder Name"
                        value={workspaceCopy?.name || ''}
                        onChange={(e) => {
                            if (!workspaceCopy) return;
                            const name = e.target.value.replace(/ /g, '-');
                            setWorkspaceCopy({
                                ...workspaceCopy,
                                name: name.toLowerCase()
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

                {template === '' && <div className="grid grid-cols-2 gap-2 mb-2">
                    <InputField
                        label="Icon"
                        icon="fas fa-icons"
                        placeholder="(optional) fontawesome icon"
                        value={workspaceCopy?.fontawesomeIcon || ''}
                        onChange={(e) => {
                            if (!workspaceCopy) return;
                            setWorkspaceCopy({
                                ...workspaceCopy,
                                fontawesomeIcon: e.target.value.toLowerCase()
                            })
                        }}
                    />
                    <InputField
                        label="Description"
                        icon="fas fa-info"
                        placeholder="(optional) description"
                        value={workspaceCopy?.description || ''}
                        onChange={(e) => {
                            if (!workspaceCopy) return;
                            setWorkspaceCopy({
                                ...workspaceCopy,
                                description: e.target.value
                            })
                        }}
                    />
                </div>
                }

                <div className="flex flex-row w-[50%] gap-2 mb-2 mt-4">
                    <InputField
                        label="Template (Optional)"
                        icon="fas fa-cube"
                        placeholder="Template name"
                        value={template}
                        onChange={(e) => {
                            setTemplate(e.target.value)
                        }}
                        disabled={ true }
                    />
                    <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="group relative h-10 mt-6  px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            Select
                        </span>
                    </button>
                </div>

            </div>

            <footer className="p-2 px-6 pb-4 flex justify-end gap-4">
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

            <TemplateSelector
                show={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                onSelect={(name) => {
                    setTemplate(name);
                    setShowTemplateSelector(false)
                }}
            />

        </ModalBody>
    )
}
