import type { ProjectTemplate } from "..";

export const N8NLocal: ProjectTemplate = {
    name: "N8N Local",
    description: "N8N (Local)",
    notes: "Requires Node.js installed in your system.",
    templating: [
        {
            action: 'command',
            command: 'npm install n8n'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.dev="npx n8n"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.start="npx n8n"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="npx kill-port 5678"'
        },
        {
            action: 'command',
            command: 'npm pkg set fontawesomeIcon="fa-solid fa-robot"'
        },
        {
            action: 'command',
            command: 'npm pkg set name="$(basename $PWD)"'
        },
    ]
};
