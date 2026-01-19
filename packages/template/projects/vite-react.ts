import type { ProjectTemplate } from "..";

export const ViteReact: ProjectTemplate = {
    name: 'Vite React TS',
    description: 'Vite React TS template',
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['create', 'vite@latest', '.', '--', '--template', 'react-ts']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'tailwindcss', '@tailwindcss/postcss', 'autoprefixer']
        },
        {
            action: 'file',
            file: 'postcss.config.js',
            filecontent: 'export default {\n  plugins: {\n    "@tailwindcss/postcss": {},\n    autoprefixer: {},\n  },\n}'
        },
        {
            action: 'file',
            file: 'src/index.css',
            filecontent: '@import "tailwindcss";'
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 5173']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-globe']
        }
    ]
};
