import type { ProjectTemplate } from "../../types";

export const StrapiLocal: ProjectTemplate = {
    name: "Strapi CMS",
    description: "Open source Headless CMS (Node.js)",
    notes: "Creates a local Strapi project with SQLite.",
    type: "app",
    category: "Project",
    icon: "fas fa-pencil-ruler text-purple-600",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'npx',
            args: ['-y', 'create-strapi-app@latest', '.', '--quickstart', '--no-run', '--yes']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=strapi develop']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=strapi start']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.build=strapi build']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 1337']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Strapi Headless CMS']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-pencil-ruler text-purple-600']
        }
    ]
};
