import type { ProjectTemplate } from "../../types";

export const PlasmicNextJS: ProjectTemplate = {
    name: "Plasmic (Next.js)",
    description: "Visual builder for the web with Next.js",
    notes: "Creates a Next.js app integrated with Plasmic.",
    type: "app",
    category: "Project",
    icon: "fas fa-paint-brush text-pink-500",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'npx',
            args: ['-y', 'create-plasmic-app@latest', '.', '--platform', 'nextjs', '--scheme', 'loader', '--lang', 'ts', '--yes']
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
            args: ['pkg', 'set', 'description=Plasmic App (Next.js)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-paint-brush text-pink-500']
        }
    ]
};
