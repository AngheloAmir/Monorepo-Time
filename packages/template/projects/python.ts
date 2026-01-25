import type { ProjectTemplate } from "..";

import files from "./files/_python";

export const PythonConsole: ProjectTemplate = {
    name: "Python Backend",
    description: "Simple Python Backend Application",
    notes: "Python 3 must be installed in your system.",
    templating: [
        {
            action: 'file',
            file: 'main.py',
            filecontent: files.mainPy
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: files.indexHtml
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=python3 main.py']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Python Backend']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx kill-port 3000']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-python text-yellow-500']
        }
    ]
};
