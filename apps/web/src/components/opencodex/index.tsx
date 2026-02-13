import useOpenCode    from "../../appstates/opencode";
import ResizerBar     from "../ui/ResizerBar";
import ProjectBrowser from "./projectBrowser";

interface OpenCodeProps {
    isVisible: boolean
}

export default function OpencodeOrchestartor({ isVisible }: OpenCodeProps) {
    const sidebarWidth    = useOpenCode.use.sidebarWidth();
    const setSidebarWidth = useOpenCode.use.setSidebarWidth();

    return (
        <div className={`h-full w-full p-2 gap-2 ${isVisible ? 'flex' : 'hidden'} `}>
            <div className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0" style={{ width: sidebarWidth }}>
               <ProjectBrowser />
            </div>

            <ResizerBar setBarWidth={setSidebarWidth} />

            <div className="bg-red-500 relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden">
                ASsaSAsaS
            </div>
        </div>
    )
}
