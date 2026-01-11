import { useEffect, useRef } from "react";
import { type WorkspaceItem } from "../../../_context/workspace";
import InteractiveTerminal, { type InteractiveTerminalRef } from "../../InteractiveTerminal";
import { useState } from "react";

export default function TabTerminalWrapper(props: { workspace: WorkspaceItem, visible: boolean }) {
    const terminalRef  = useRef<InteractiveTerminalRef>(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        return () => {
            if (terminalRef.current) {
                terminalRef.current.disconnect();
            }
        }
    }, []); 

    useEffect(() => {
        if( props.workspace.isRunningAs != null ) {
            if( terminalRef.current ) {
                if( isRunning ) return;
                setIsRunning(true);

                if(props.workspace.isRunningAs == 'dev' || props.workspace.isRunningAs == 'start') {
                    terminalRef.current.connect(props.workspace.info.path);
                    terminalRef.current.clear();
                    terminalRef.current.onClose(() => {
                        console.log('server crash')
                    });
                    setTimeout(() => {
                        terminalRef.current?.input('npm run ' + props.workspace.isRunningAs );
                        setIsRunning(false);
                    }, 100);
                }
            }
        }
    }, [ props.workspace.isRunningAs ]);

    return (
        <div className={`w-full h-full ${props.visible ? 'block' : 'hidden'}`}>
            <InteractiveTerminal
                ref={terminalRef}
                isInteractive={false}
                onExit={() => {
                    console.log('server crash')
                }}
            />
        </div>
    );
}