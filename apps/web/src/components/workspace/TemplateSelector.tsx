import type { ProjectTemplate } from "types";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";
import { useEffect, useState } from "react";
import useAppState from "../../appstates/app";

interface TemplateSelectorProps {
    show: boolean;
    onClose:  () => void;
    onSelect: (name: string, type: string) => void;
}


export default function TemplateSelector(props: TemplateSelectorProps) {
    const getTemplates = useAppState.use.getTemplates();
    const [templates, setTemplates] = useState<{
        project:  ProjectTemplate[],
        database: ProjectTemplate[],
        services: ProjectTemplate[],
        tool:     ProjectTemplate[],
        demo:     ProjectTemplate[],
    }>({
        project:  [],
        database: [],
        services: [],
        tool:     [],
        demo:     [],
    });
    const [activeTab, setActiveTab] = useState<'Project' | 'Database' | 'Services' | 'Tool' | 'Demo'>('Project');

    useEffect(() => {
        if (!props.show) return;
        const loadTemplates = async () => {
            const data = await getTemplates();
            const temp = {
                project:     data.project || [],
                database:    data.database || [],
                services:    data.services || [],
                tool:        data.tool || [],
                demo:        data.demo || [],
            }
            setTemplates(temp);
        }
        loadTemplates();
    }, [props.show]);

    if (!props.show) return null;
    return (
        <ModalBody width="700px">
            <ModalHeader
                close={() => props.onClose()}
                title="Select Template"
                description="Choose a template to initialize your workspace"
            />
            <div className="flex flex-col gap-4 overflow-hidden h-[550px] p-2">
                <div className="flex items-center gap-1 overflow-x-auto p-1 border-b border-white/5 no-scrollbar shrink-0">
                    <TabItem name="Project" icon="fas fa-code" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Database" icon="fas fa-database" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Services" icon="fas fa-server" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Tool" icon="fas fa-tools" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="w-px h-5 bg-white/10 mx-2 self-center"></div>
                    <TabItem name="Demo" icon="fas fa-cube" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1 w-full overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-3 pr-2 pb-2">
                        <ProjectItem show={activeTab === 'Project'} project={templates.project} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Database'} project={templates.database} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Services'} project={templates.services} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Tool'} project={templates.tool} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Demo'} project={templates.demo} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                    </div>
                </div>
            </div>
        </ModalBody>
    )
}

//==============================================================================================
function TabItem({ name, icon, activeTab, setActiveTab }: { name: string, icon: string, activeTab: string, setActiveTab: (tab: any) => void }) {
    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${activeTab === name
                    ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
        >
            <i className={`${icon} ${activeTab === name ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'} text-sm`}></i>
            {name}
        </button>
    )
}

//==============================================================================================
function ProjectItem({ project, onClick, show }: { project: ProjectTemplate[], onClick: (project: string, type: string) => void, show: boolean }) {
    if(!show) return null;
    
    return (
        <>
            {project.map((project, index) => (
                <button
                    key={index}
                    onClick={() => onClick(project.name, project.type)}
                    className="group relative flex flex-col p-2 hover:bg-gray-800/60 hover:border-white/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 text-left w-full overflow-hidden"
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center w-10 h-10 text-gray-400">
                            <i className={`${project.icon} text-lg`}></i> 
                        </div>
                        <span className="font-bold text-gray-200 group-hover:text-white text-base truncate tracking-tight">{project.name}</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                            <i className="fas fa-arrow-right text-gray-400 group-hover:text-blue-400 text-sm"></i>
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 leading-relaxed pl-0.5">
                        {project.description}
                    </div>

                    {/* {project.notes && (
                        <div className="mt-3 flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 px-2.5 py-1.5 rounded-md border border-amber-500/10 w-fit">
                            <i className="fas fa-info-circle mt-0.5"></i>
                            <span className="font-medium opacity-90">{project.notes}</span>
                        </div>
                    )} */}
                </button>
            ))}
        </>
    )
}