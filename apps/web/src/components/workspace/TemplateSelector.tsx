import type { ProjectTemplate } from "types";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";
import { useEffect, useState } from "react";
import useAppState from "../../appstates/app";

interface TemplateSelectorProps {
    show: boolean;
    onClose: () => void;
    onSelect: (name: string) => void;
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
            <div className="flex-1 flex flex-row gap-2 overflow-hidden p-2">
                <div className="w-48">
                    <TabItem name="Project" icon="fas fa-code" activeTab={activeTab} setActiveTab={setActiveTab} />

                    <h2 className="text-sm font-bold text-white mt-4 ml-2 mb-1">
                        Local Testing
                        <span className="text-red-500 text-xs ml-1">
                            *DOCKER
                        </span>
                    </h2>
                    <TabItem name="Database" icon="fas fa-database" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Services" icon="fas fa-server" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabItem name="Tool" icon="fas fa-tools" activeTab={activeTab} setActiveTab={setActiveTab} />

                    <h2 className="text-sm font-bold text-gray-600 my-2 ml-2">Sample Projects</h2>
                    <TabItem name="Demo" icon="fas fa-cube" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1 w-full h-[500px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <ProjectItem show={activeTab === 'Project'} project={templates.project} onClick={(name) => {
                            props.onSelect(name);
                        }}/>
                        <ProjectItem show={activeTab === 'Database'} project={templates.database} onClick={(name) => {
                            props.onSelect(name);
                        }}/>
                        <ProjectItem show={activeTab === 'Services'} project={templates.services} onClick={(name) => {
                            props.onSelect(name);
                        }}/>
                        <ProjectItem show={activeTab === 'Tool'} project={templates.tool} onClick={(name) => {
                            props.onSelect(name);
                        }}/>
                        <ProjectItem show={activeTab === 'Demo'} project={templates.demo} onClick={(name) => {
                            props.onSelect(name);
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
const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('react')) return 'fab fa-react text-blue-400';
    else if (n.includes('next.js')) return 'fab fa-js text-white';
    else if (n.includes('express')) return 'fab fa-node text-green-500';
    else if (n.includes('php')) return 'fab fa-php text-indigo-400';
    else if (n.includes('laravel')) return 'fab fa-laravel text-red-500';
    else if (n.includes('.net')) return 'fab fa-windows text-blue-600';
    else if (n.includes('python')) return 'fab fa-python text-yellow-500';
    else if (n.includes('mysql')) return 'fas fa-database text-blue-500';
    else if (n.includes('postgres')) return 'fas fa-database text-blue-300';
    else if (n.includes('supabase')) return 'fas fa-bolt text-green-400';
    else if (n.includes('redis')) return 'fas fa-server text-red-400';
    else if (n.includes('mongo')) return 'fas fa-leaf text-green-500';
    else if (n.includes('n8n')) return 'fas fa-project-diagram text-red-500';
    else if (n.includes('aws')) return 'fab fa-aws text-orange-400';
    else if (n.includes('mailpit')) return 'fas fa-envelope text-blue-500';
    else if (n.includes('cloudbeaver')) return 'fas fa-database text-orange-500';
    else if (n.includes('pgweb')) return 'fas fa-database text-blue-500';
    else if (n.includes('mongo-express')) return 'fas fa-leaf text-green-500';
    else if (n.includes('redis-commander')) return 'fas fa-server text-red-400';
    else if (n.includes('chat to monochat')) return 'fas fa-comments text-green-500';
    else if (n.includes('localstack')) return 'fab fa-aws text-orange-500';
    else if (n.includes('stripe')) return 'fab fa-stripe text-orange-500';
    else if (n.includes('yaade')) return 'fas fa-vial text-purple-500';
    else if (n.includes('mattermost')) return 'fas fa-comments text-green-500';
    else return 'fas fa-cube text-gray-400';
}

//==============================================================================================
function ProjectItem({ project, onClick, show }: { project: ProjectTemplate[], onClick: (project: string) => void, show: boolean }) {
    if(!show) return null;
    
    return (
        <>
            {project.map((project) => (
                <button
                    onClick={() => onClick(project.name)}
                    className="flex items-center p-2 hover:bg-gray-800 text-left w-full"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <i className={`${getIcon(project.name)} text-xl`}></i> 
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