import { ProjectTemplate } from "..";

export const Supabase: ProjectTemplate = {
    name: "Supabase",
    description: "Supabase (Docker)",
    notes: "Requires Docker installed.",
    templating: [
        {
            action: 'command',
            command: 'npm install supabase --save-dev'
        },
        {
            action: 'command',
            command: 'npx supabase init'
        },

        {
            action: 'command',
            command: 'npm pkg set scripts.start="npx supabase start"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="npx supabase stop"'
        }
    ]
};
