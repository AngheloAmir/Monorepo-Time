import type { AvailbleTemplates, ProjectTemplate } from "types";
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
    const [templates, setTemplates] = useState<AvailbleTemplates>({
        project:  [],
        database: [],
        services: [],
        opensource: [],
        tool:     [],
        demo:     [],
    });
    const [activeTab, setActiveTab] = useState<string>('Project');

    useEffect(() => {
        if (!props.show) return;
        const loadTemplates = async () => {
            const data = await getTemplates();
            const temp = {
                project:     data.project     || [],
                database:    data.database    || [],
                services:    data.services    || [],
                opensource:  data.opensource  || [],
                tool:        data.tool        || [],
                demo:        data.demo        || [],
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
            <div className="flex-1 flex flex-row gap-2 overflow-hidden p-2">
                <div className="w-48">
                    <TabItem name="Project" icon="fas fa-code" activeTab={activeTab} setActiveTab={setActiveTab} />

                    <h2 className="text-sm font-bold text-gray-600 my-2 ml-2 flex gap-2">
                        <li className="fab fa-docker"></li>Docker Apps
                    </h2>
                    <TabItem name="Database" icon="fas fa-database" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Services" icon="fas fa-server" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Open Source" icon="fa-brands fa-github" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Tool" icon="fas fa-tools" activeTab={activeTab} setActiveTab={setActiveTab} />

                    <h2 className="text-sm font-bold text-gray-600 my-2 ml-2">Sample Projects</h2>
                    <TabItem name="Demo" icon="fas fa-cube" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1 w-full h-[500px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <ProjectItem show={activeTab === 'Project'} project={templates.project} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Database'} project={templates.database} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Services'} project={templates.services} onClick={(name, type) => {
                            props.onSelect(name, type);
                        }}/>
                        <ProjectItem show={activeTab === 'Open Source'} project={templates.opensource} onClick={(name, type) => {
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left
                    ${activeTab === name
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
        >
            <i className={`${icon} w-5 text-center ${activeTab === name ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`}></i>
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
                    className="flex items-center p-2 hover:bg-gray-800 text-left w-full"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <i className={`${project.icon} text-xl`}></i> 
                            <span className="font-bold text-gray-200 group-hover:text-white text-base truncate">{project.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 mt-1 leading-relaxed">
                            {project.description}
                        </div>
                        {project.notes && (
                            <div className="flex items-start gap-1.5 text-[11px] text-amber-400/90  w-fit">
                                <i className="fas fa-info-circle mt-0.5"></i>
                                <span className="font-medium opacity-90">{project.notes}</span>
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </>
    )
}