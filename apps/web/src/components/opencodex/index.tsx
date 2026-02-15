import { useEffect, useState }   from "react";
import useOpencode    from "../../appstates/opencode";
import ResizerBar     from "../ui/ResizerBar";
import InitMessage    from "./InitMessage";
import ProjectBrowser from "./projectBrowser";
import OpencodeGUI    from "./opencodeGUI";

interface OpenCodeProps {
    isVisible: boolean
}

export default function OpencodeOrchestartor({ isVisible }: OpenCodeProps) {
    const opencodeInstances = useOpencode.use.opencodeInstances();
    const sidebarWidth      = useOpencode.use.sidebarWidth();
    const setSidebarWidth   = useOpencode.use.setSidebarWidth();
    const loadInstances     = useOpencode.use.loadInstances();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const checkOpencodeInstalled = useOpencode.use.checkOpencodeInstalled();

    useEffect(() => {
        checkOpencodeInstalled();
        loadInstances();
    }, []);

    useEffect(() => {
        if( isVisible ) loadInstances();
    }, [isVisible]);

    return (
        <div className={`h-full w-full p-2 gap-2 ${isVisible ? 'flex' : 'hidden'} `}>
            <div className="flex flex-col gap-3 h-full min-h-0 overflow-y-auto shrink-0" style={{ width: sidebarWidth }}>
               <ProjectBrowser
                    isVisible={isVisible}
               />
            </div>

            <ResizerBar setBarWidth={setSidebarWidth} />

            <div 
                className="relative flex-1 h-full min-h-0 min-w-0 flex flex-col rounded overflow-hidden"
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!isDraggingOver) setIsDraggingOver(true);
                }}
            >
                {
                    opencodeInstances.length === 0 ? (
                        <InitMessage
                            isVisible={isVisible}
                            onStart={() => {}}
                            // onStartManual={() => {}}
                        />
                    ) : (
                        <OpencodeGUI />
                    )
                }
            </div>
        </div>
    )
}
