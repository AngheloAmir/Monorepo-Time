import type { ProjectTemplate } from "..";

export const NextJS: ProjectTemplate = {
    name: "Next.js TS",
    description: "Next.js TS template",
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            command: 'rm -rf ./* ./.[!.]* 2>/dev/null || true'
        },
        {
            action: 'command',
            command: 'npx -y create-next-app@latest . --typescript --tailwind --eslint --app --yes --use-npm'
        },
        {
            action: 'command',
            command: 'npm install'
        },
        {
            action: 'command',
            command: 'npm pkg set name="$(basename $PWD)"'
        },
        {
            action: 'command',
            command: 'npm pkg set fontawesomeIcon="fa-solid fa-globe"'
        }
    ]
};
