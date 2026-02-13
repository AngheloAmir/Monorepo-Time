import config from 'config';
import TreeItem from "./TreeItem";
import useProjectState from "../../../appstates/project";
import ProjectEdit from './ProjectEdit';
import FileEditor  from './FileEditor';

interface ProjectBrowserProps {
    className?: string;
}

export default function ProjectBrowser(props: ProjectBrowserProps) {
    const projectTree = useProjectState.use.projectTree();
    const setSelectedPath = useProjectState.use.setSelectedPath();

    return (
        <div className={`flex flex-col h-full min-h-0 bg-gray-800/20 rounded ${props.className}`}>
            <ProjectEdit />

            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-1"
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPath("");
                }}
            >
                {projectTree && projectTree.length > 0 ? (
                    projectTree.map((item, i) => (
                        <TreeItem key={i} item={item} />
                    ))
                ) : (
                    <div className="p-4 text-center text-white/20 text-xs italic">
                        {config.useDemo ? "Demo Mode - No Project" : "Loading or empty..."}
                    </div>
                )}
            </div>

            <FileEditor />
        </div>
    );
}
