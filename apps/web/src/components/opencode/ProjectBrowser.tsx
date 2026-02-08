import config from 'config';
import TreeItem from "./TreeItem";
import useProjectState from "../../appstates/project";
import { useEffect } from "react";
import CommitInput from "./CommitInput";

interface ProjectBrowserProps {
    className?: string;
}

export default function ProjectBrowser(props: ProjectBrowserProps) {
    const changesCount    = useProjectState.use.changes();
    const projectTree     = useProjectState.use.projectTree();
    const loadProjectTree = useProjectState.use.loadProjectTree();

    useEffect(() => {
        loadProjectTree();
    }, []);

    return (
        <div className={`flex flex-col h-full min-h-0 bg-gray-800/20 rounded ${props.className}`}>
            <div className="flex items-center justify-between p-2">
                <div className="text-xs font-medium text-white/40 uppercase tracking-wider pl-1">
                    Changes: { changesCount } file{ changesCount > 1 ? "s" : "" }
                </div>
                <div 
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 cursor-pointer text-white/40 hover:text-white transition-colors"
                    onClick={() => loadProjectTree()}
                    title="Refresh"
                >
                    <i className="fa-solid fa-arrows-rotate text-xs"></i>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-1">
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

            <div className="p-2">
               <CommitInput />
            </div>
        </div>
    );
}
