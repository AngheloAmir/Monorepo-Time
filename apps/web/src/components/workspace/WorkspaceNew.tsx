import type { WorkspaceInfo } from "types";
import useWorkspaceState from "../../appstates/workspace";
import { useEffect, useState } from "react";

import TemplateSelector from "./TemplateSelector";
import TemplateWindow from "./WorkspaceNew/TemplateWindow";
import ToolWindow from "./WorkspaceNew/ToolWindow";

const clearInfo: WorkspaceInfo = {
    name: '',
    path: '',
    fontawesomeIcon: '',
    description: '',
    devCommand: ''
}

export default function WorkspaceNew() {
    const [workspaceCopy, setWorkspaceCopy] = useState<WorkspaceInfo>(clearInfo);
    const [error, setError] = useState('');
    const showWorkspaceNew = useWorkspaceState.use.showWorkspaceNew();
    const workspace = useWorkspaceState.use.workspace();
    const createNewWorkspace = useWorkspaceState.use.createNewWorkspace();
    const setShowWorkspaceNew = useWorkspaceState.use.setShowWorkspaceNew();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const loadWorkspace = useWorkspaceState.use.loadWorkspace();
    const setWorkspaceTemplate = useWorkspaceState.use.setWorkspaceTemplate();
    const setWorkspaceLoading = useWorkspaceState.use.setWorkspaceLoading();

    const [template, setTemplate] = useState('');
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [templateType, setTemplateType] = useState('');

    //============================================================================================
    useEffect(() => {
        if (showWorkspaceNew) {
            setTemplate('');
            setTemplateType('');
        }
    }, [showWorkspaceNew]);

    function close() {
        setError('');
        setShowWorkspaceNew(false);
    }

    async function createWorkspace() {
        if (templateType !== 'tool' && (workspaceCopy.name === '' || workspaceCopy.path === '')) {
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
            setShowWorkspaceNew(false);

            if (templateType != 'tool') {
                //add a new folder
                const response = await createNewWorkspace(newWorkspaceToAdd);
                if (response) {
                    if (template)
                        //this one sets the content if this is a template based workspace
                        await setWorkspaceTemplate(newWorkspaceToAdd, template);
                    else {
                        setWorkspaceLoading(false);
                        setShowNewTerminalWindow(newWorkspaceToAdd);
                    }
                }
            } else {
                //this one sets the content if this is a tool based workspace
                await setWorkspaceTemplate(newWorkspaceToAdd, template);
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
        <>
            {templateType == 'tool' || templateType == 'opensource-app' ?
                <ToolWindow
                    template={template}
                    setTemplate={setTemplate}
                    setShowTemplateSelector={setShowTemplateSelector}
                    close={close}
                    createWorkspace={createWorkspace}
                />
                :
                <TemplateWindow
                    createWorkspace={createWorkspace}
                    templateType={templateType}
                    setTemplateType={setTemplateType}
                    workspaceCopy={workspaceCopy}
                    setWorkspaceCopy={setWorkspaceCopy}
                    setShowTemplateSelector={setShowTemplateSelector}
                    template={template}
                    close={close}
                    error={error}
                    setError={setError}
                />
            }

            <TemplateSelector
                show={showTemplateSelector}
                onClose={() => setShowTemplateSelector(false)}
                onSelect={(name, type) => {
                    setTemplate(name);
                    setTemplateType(type);
                    setShowTemplateSelector(false)
                }}
            />
        </>
    )
}
