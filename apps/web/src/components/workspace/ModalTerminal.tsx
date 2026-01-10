import useWorkspaceState from "../../_context/workspace";
import Console from "../Console";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { useEffect, useState } from "react";
import apiRoute from 'apiroute';
import config   from 'config';

export default function ModalTerminal() {
    const showNewTerminalWindow = useWorkspaceState.use.showNewTerminalWindow();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const [output, setOutput]       = useState("");
    const [inputText, setInputText] = useState("");
    const [waiting, setWaiting]     = useState(false);

    useEffect(() => {
        if (showNewTerminalWindow) {
            const firstLine  = `\x1b[34m[PATH]\x1b[0m \x1b[32m${showNewTerminalWindow?.path}\x1b[0m`;
            const secondLine = `\x1b[34m[SYSTEM]\x1b[0m Please enter your command prompt.`;
            const thirdLine  = `\x1b[34m[SYSTEM]\x1b[0m Example: npm install nodemon -D`;
            setOutput(`${firstLine}`);
            setTimeout(() => {
                setOutput(`${firstLine}\n${secondLine}`);
            }, 200);
            setTimeout(() => {
                setOutput(`${firstLine}\n${secondLine}\n${thirdLine}`);
            }, 400);
        }
    }, [showNewTerminalWindow]);

    const close = () => {
        setShowNewTerminalWindow(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(waiting)     return;
        if (!inputText) return;
        setWaiting(true);

        const userInput = inputText;
        setOutput(`${output}\n${userInput}`);
        setInputText("");


        //start the interactive terminal here ================================================
        fetch(`http://localhost:${config.apiPort}/${apiRoute.interactvTerminal}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workspaceName: showNewTerminalWindow?.name,
                command:       userInput
            })
        })


        //====================================================================================

        setWaiting(false);
    };

    if (!showNewTerminalWindow) return null;
    return (
        <ModalBody>
            <ModalHeader
                close={close}
                title={showNewTerminalWindow.name || ""}
                description={showNewTerminalWindow.description || ""}
                icon="fas fa-terminal text-blue-500 text-xl"
            />

            <div className="flex-1 overflow-y-auto p-3">
                <Console
                    consoleOutput={output}
                    show={true}
                />
            </div>

            <form onSubmit={handleSubmit} className="flex-none flex gap-4 w-full p-2">
                <input 
                    type="text" 
                    className="w-full h-8 p-1 rounded-md border border-gray-600" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button type="button" onClick={close} className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-1 rounded-md">Close</button>
            </form>
        </ModalBody>
    );
}