import { ProjectTemplate } from "..";

export const NextJS: ProjectTemplate = {
    name: "Next.js TS",
    description: "Next.js TS template",
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            command: 'npx create-next-app@latest . --typescript --tailwind --eslint'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="npx kill-port 3000"'
        }
    ]
};
