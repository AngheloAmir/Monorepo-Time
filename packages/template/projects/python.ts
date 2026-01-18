import type { ProjectTemplate } from "..";

const pythonFile = `print("Monorepo Time Console!")
name = input("Please enter your name: ")
print("Hello " + name)
`;

export const PythonConsole: ProjectTemplate = {
    name: "Python Console",
    description: "Simple Python Console Application",
    notes: "Python 3 must be installed in your system.",
    templating: [
        {
            action: 'file',
            file: 'main.py',
            filecontent: pythonFile
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.dev="python3 main.py"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.start="python3 main.py"'
        },
        {
            action: 'command',
            command: "npm pkg set scripts.fontawesomeIcon=\"fa-solid fa-terminal\""
        }
    ]
};
