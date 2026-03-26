import DocBrowser from "../docs/DocBrowser";
import TextEditor from "../docs/TextEditor";
import useDocsState from "../../appstates/docs";
import ResizerBar from "../ui/ResizerBar";

interface DocsProps {
    isVisible: boolean;
}

export default function Docs(props: DocsProps) {
    const sidebarWidth = useDocsState.use.sidebarWidth();
    const setSidebarWidth = useDocsState.use.setSidebarWidth();
    
    return (
         <div className={`h-full w-full p-2 gap-2 ${props.isVisible ? 'flex' : 'hidden'}`}>
            <div className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0" style={{ width: sidebarWidth }}>
                <DocBrowser isVisible={props.isVisible} />
            </div>

            <ResizerBar setBarWidth={setSidebarWidth} />

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden">
                <TextEditor />
            </div>
         </div>
    )
}