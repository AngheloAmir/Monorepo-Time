import type { ProjectTemplate } from "..";

export const PHP: ProjectTemplate = {
    name: "PHP",
    description: "Simple PHP project template",
    notes: "PHP must be installed in your system.",
    templating: [
        {
            action: 'file',
            file: 'index.php',
            filecontent: '<?php\n\necho "Hello World! Monorepo Time!";\n'
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=php -S localhost:3000']
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
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-server']
        }
    ]
};
