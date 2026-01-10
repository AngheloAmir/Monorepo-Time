import { useState, useEffect, useRef } from "react";
import TurboButtons from "../components/turborepo/TurboButtons";
import TurboConsole, { type TurboConsoleRef } from "../components/turborepo/TurboConsole";
import config from 'config';
// @ts-ignore
import apiRoute from 'apiroute';

interface TurborepoProps {
    isVisible : boolean
}

export default function Turborepo( props : TurborepoProps ) {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const consoleRef = useRef<TurboConsoleRef>(null);

    useEffect(() => {
        // Fetch root path on mount
        const port = config.apiPort || 3000;
        fetch(`http://localhost:${port}/${apiRoute.getRootPath}`)
            .then(res => res.json())
            .then(data => setRootPath(data.path))
            .catch(err => console.error("Failed to fetch root path", err));
    }, []);

    useEffect(() => {
        if (props.isVisible && consoleRef.current) {
            setTimeout(() => {
                consoleRef.current?.fit();
            }, 50);
        }
    }, [props.isVisible]);

    const handleCommand = (cmd: string) => {
        if (consoleRef.current) {
            consoleRef.current.runCommand(cmd);
        }
    };

    return (
        <div className={`h-[92%] w-full p-4 gap-4  ${props.isVisible ? 'grid grid-cols-5' : 'hidden'}`}>

             <div className="col-span-2 h-full">
               <TurboButtons onCommand={handleCommand} /> 
            </div>

            <div className="col-span-3 flex-1 h-full">
               <TurboConsole ref={consoleRef} rootPath={rootPath} />
            </div>
        </div>
    )
}