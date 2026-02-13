import useOpencodeX from "../../appstates/opencodex";
import ResizerBar     from "../ui/ResizerBar";
import InitMessage from "./InitMessage";
import ProjectBrowser from "./projectBrowser";

interface OpenCodeProps {
    isVisible: boolean
}

export default function OpencodeOrchestartor({ isVisible }: OpenCodeProps) {
    const sidebarWidth    = useOpencodeX.use.sidebarWidth();
    const setSidebarWidth = useOpencodeX.use.setSidebarWidth();

    return (
        <div className={`h-full w-full p-2 gap-2 ${isVisible ? 'flex' : 'hidden'} `}>
            <div className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0" style={{ width: sidebarWidth }}>
               <ProjectBrowser
                    isVisible={isVisible}
               />
            </div>

            <ResizerBar setBarWidth={setSidebarWidth} />

            <div className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden">
               <InitMessage
                    isVisible={isVisible}
                    onStart={() => {}}
                    onStartManual={() => {}}
               />
            </div>
        </div>
    )
}
