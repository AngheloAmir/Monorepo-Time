import type { ProjectTemplate } from "..";

export const ViteReact: ProjectTemplate = {
    name: 'Vite React TS',
    description: 'Vite React TS template',
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            command: 'npx create-vite@latest . --template react-ts'
        },
        {
            action: 'command',
            command: 'npm install -D tailwindcss postcss autoprefixer'
        },
        {
            action: 'file',
            file: 'tailwind.config.js',
            filecontent: '/** @type {import(\'tailwindcss\').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}'
        },
        {
            action: 'file',
            file: 'postcss.config.js',
            filecontent: 'export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}'
        },
        {
            action: 'file',
            file: 'src/index.css',
            filecontent: '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="npx kill-port 5173"'
        }
    ]
};
