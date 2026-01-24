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
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=python3 main.py']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=python3 main.py']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-python text-yellow-500']
        }
    ]
};
