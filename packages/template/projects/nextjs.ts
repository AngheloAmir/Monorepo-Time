import type { ProjectTemplate } from "..";

export const NextJS: ProjectTemplate = {
    name: "Next.js TS",
    description: "Next.js TS template",
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'npx',
            args: ['-y', 'create-next-app@latest', '.', '--typescript', '--tailwind', '--eslint', '--app', '--yes', '--use-npm']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-globe']
        }
    ]
};
