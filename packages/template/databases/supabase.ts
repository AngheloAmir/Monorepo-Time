import type { ProjectTemplate } from "../../types";

export const Supabase: ProjectTemplate = {
    name: "Supabase",
    description: "Supabase (Docker)",
    notes: "Requires Docker installed.",
    type: "database",
    icon: "fas fa-bolt text-green-400",
    templating: [
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', 'supabase', '--save-dev']
        },
        {
            action: 'command',
            cmd: 'npx',
            args: ['supabase', 'init']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=npx supabase start']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx supabase stop']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Supabase (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=database']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-bolt text-green-500']
        }
    ]
};
