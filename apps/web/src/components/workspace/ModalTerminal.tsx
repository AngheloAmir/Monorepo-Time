import useWorkspaceState from "../../_context/workspace";
import Console from "../Console";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { useState } from "react";

export default function ModalTerminal() {
    const showNewTerminalWindow = useWorkspaceState.use.showNewTerminalWindow();
    const setShowNewTerminalWindow = useWorkspaceState.use.setShowNewTerminalWindow();
    const [output] = useState(`asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.   
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.       
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. 
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
asd lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.       
`);

    const close = () => {
        setShowNewTerminalWindow(null);
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

            <footer className="flex-none w-full p-2">
                <button onClick={close} className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded-md">Close</button>
            </footer>
        </ModalBody>
    );
}