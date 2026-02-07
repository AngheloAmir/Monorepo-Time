import type { WorkspaceInfo } from "types";
import SelectField from "../../SelectField";
import InputField from "../../ui/InputField";
import ModalBody from "../../ui/ModalBody";
import ModalHeader from "../../ui/ModalHeader";
import { useEffect, useState } from "react";
import useWorkspaceState from "../../../appstates/workspace";
import Button3 from "../../ui/Button3";

const clearInfo: WorkspaceInfo = {
    name: '',
    path: '',
    fontawesomeIcon: '',
    description: '',
    devCommand: ''
}

interface Props {
    createWorkspace: () => void;
    templateType: string;
    setTemplateType: (templateType: string) => void;
    workspaceCopy: WorkspaceInfo;
    setWorkspaceCopy: (workspaceCopy: WorkspaceInfo) => void;
    setShowTemplateSelector: (showTemplateSelector: boolean) => void;
    template: string;
    error: string;
    setError: (error: string) => void;
    close: () => void;
}

export default function TemplateWindow( props: Props) {
    const [paths, setpaths] = useState<(string | { label: string; path: string })[]>([]);
    const showWorkspaceNew  = useWorkspaceState.use.showWorkspaceNew();
    const listWorkspaceDir  = useWorkspaceState.use.listWorkspace();

    useEffect(() => {
        if (showWorkspaceNew) {
            const loadPaths = async () => {
                const data = await listWorkspaceDir();
                setpaths(data);

                props.setWorkspaceCopy({
                    ...clearInfo,
                    path: data[0].path || ''
                });
                props.setTemplateType('');
            }
            loadPaths();
        }
    }, [showWorkspaceNew]);

    return (
        <ModalBody>
            <ModalHeader close={props.close} title="New Workspace App" description="Create a new application inside the workspace" />

            <div className="p-3 flex-1 overflow-y-auto text-md">
                {props.error &&
                    <p className="text-red-500">{props.error}</p>}

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <InputField
                        label="Name (small letters)"
                        icon="fa fa-cube"
                        placeholder="Package and Folder Name"
                        value={props.workspaceCopy?.name || ''}
                        onChange={(e) => {
                            if (!props.workspaceCopy) return;
                            const name = e.target.value.replace(/ /g, '-');
                            props.setWorkspaceCopy({
                                ...props.workspaceCopy,
                                name: name.toLowerCase()
                            })
                        }}
                    />  
                    <SelectField
                        label="Workspace Directory"
                        icon="fas fa-folder"
                        placeholder="Select a workspace directory"
                        value={props.workspaceCopy?.path || ''}
                        onChange={(e) => {
                            if (!props.workspaceCopy) return;
                            props.setWorkspaceCopy({
                                ...props.workspaceCopy,
                                path: e.target.value
                            })
                        }}
                        options={paths}
                    />
                </div>

                {props.template === '' && <div className="grid grid-cols-2 gap-2 mb-2">
                    <InputField
                        label="Icon"
                        icon="fas fa-icons"
                        placeholder="(optional) fontawesome icon"
                        value={props.workspaceCopy?.fontawesomeIcon || ''}
                        onChange={(e) => {
                            if (!props.workspaceCopy) return;
                            props.setWorkspaceCopy({
                                ...props.workspaceCopy,
                                fontawesomeIcon: e.target.value.toLowerCase()
                            })
                        }}
                    />
                    <InputField
                        label="Description"
                        icon="fas fa-info"
                        placeholder="(optional) description"
                        value={props.workspaceCopy?.description || ''}
                        onChange={(e) => {
                            if (!props.workspaceCopy) return;
                            props.setWorkspaceCopy({
                                ...props.workspaceCopy,
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
                        value={props.template}
                        disabled={true}
                        onChange={() => {}}
                    />
                    <button
                        onClick={() => props.setShowTemplateSelector(true)}
                        className="group relative h-10 mt-6  px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            Select
                        </span>
                    </button>
                </div>

            </div>

            <footer className="p-2 px-6 pb-4 flex justify-end gap-4">
                <button
                    onClick={props.close}
                    className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden"
                >
                    <span className="relative z-10">Cancel</span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <Button3
                    onClick={props.createWorkspace}
                    text="Create New App"
                    icon="fas fa-plus"
                />
            </footer>

            

        </ModalBody>
    )
}