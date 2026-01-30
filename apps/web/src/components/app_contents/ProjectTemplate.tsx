import MonorepoTemplates from "template";
import type { ProjectTemplate } from "types";

interface ProjectTemplateProps {
    isVisible: boolean;
}

export default function ProjectTemplate(props: ProjectTemplateProps) {
    const templates = MonorepoTemplates.project;

    return (
        <div className={`${props.isVisible ? 'flex' : 'hidden'} h-full flex-col p-8 gap-6 overflow-y-auto`}>
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Project Templates</h1>
                <p className="text-gray-400 mt-2">Select a template to generate a new project structure.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                {templates.map((template: ProjectTemplate, index: number) => (
                    <TemplateCard key={index} template={template} />
                ))}
            </div>
        </div>
    );
}

function TemplateCard({ template }: { template: ProjectTemplate }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:shadow-lg transition-all duration-200 group flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-zinc-750 transition-colors">
                    <i className="fas fa-cube text-xl text-blue-400"></i>
                </div>
            </div>
            
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {template.description}
                </p>
            </div>

            {template.notes && (
                <div className="pt-4 border-t border-zinc-800 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 px-3 py-2 rounded-md">
                        <i className="fas fa-info-circle"></i>
                        <span className="font-medium line-clamp-1">{template.notes}</span>
                    </div>
                </div>
            )}
        </div>
    );
}