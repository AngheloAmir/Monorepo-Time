import type { ProjectTemplate } from "..";
import { phpContent } from "./files/_php";

export const PHP: ProjectTemplate = {
    name: "PHP",
    description: "Simple PHP project template",
    notes: "PHP must be installed in your system.",
    templating: [
        {
            action: 'file',
            file: 'index.php',
            filecontent: phpContent
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=php -S localhost:3000']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx kill-port 3000']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=PHP']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-php text-indigo-500']
        }
    ]
};
