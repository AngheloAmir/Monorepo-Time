import { useEffect, useRef } from "react";
import useWorkspaceState, { type WorkspaceItem } from "../../../_context/workspace";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../../InteractiveTerminal";

export default function TabTerminalWrapper(props: { workspace: WorkspaceItem, visible: boolean }) {
    const setWorkSpaceRunningAs = useWorkspaceState.use.setWorkSpaceRunningAs();
    const terminalRef           = useRef<InteractiveTerminalRef>(null);

    useEffect(() => {
        return () => {
            if (terminalRef.current) {
                terminalRef.current.disconnect();
            }
        }
    }, []); 

    useEffect(() => {
        const runAs = props.workspace.isRunningAs;

        if (runAs === 'dev' || runAs === 'start') {
            if (terminalRef.current) {
                terminalRef.current.connect(props.workspace.info.path, `npm run ${runAs}`, props.workspace.info.name);
                terminalRef.current.onCrash(() => {
                    setWorkSpaceRunningAs(props.workspace.info.name, 'crashed');
                });
            }
        } 
        else if( runAs == 'crashed') {
            if(terminalRef.current) {
                terminalRef.current.disconnect();
            }
        }
        else {
            if(terminalRef.current) {
                terminalRef.current.disconnect();
                terminalRef.current.clear();
            }
        }
    }, [ props.workspace.isRunningAs ]);

    return (
        <div className={`w-full h-full ${props.visible ? 'block' : 'hidden'}`}>
            <InteractiveTerminal
                ref={terminalRef}
                isInteractive={false} 
            />
        </div>
    );
}