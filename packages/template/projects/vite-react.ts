import type { ProjectTemplate } from "..";

export const ViteReact: ProjectTemplate = {
    name: 'Vite React TS',
    description: 'Vite React TS template',
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            command: 'npx -y create-vite@latest --template react-ts --no-interactive --overwrite .'
        },
        {
            action: 'command',
            command: 'npm install -D tailwindcss @tailwindcss/postcss autoprefixer'
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
            command: 'npm pkg set scripts.stop="npx -y kill-port 5173"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.fontawesomeIcon="fa-solid fa-globe"'
        }
    ]
};
