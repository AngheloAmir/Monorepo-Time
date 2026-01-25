import type { ProjectTemplate } from "..";

export const N8NLocal: ProjectTemplate = {
    name: "N8N Local",
    description: "N8N (Local)",
    notes: "Requires Node.js installed in your system.",
    templating: [
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', 'n8n']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=npx n8n']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=npx n8n']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx kill-port 5678']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-project-diagram text-red-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=N8N (Local)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
    ]
};
