import { ProjectTemplate } from ".";
import expressFile from "./express";
import netFile from "./net";
import pythonFile from "./python";

const templates: ProjectTemplate[] = [
    {
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
    },
    {
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
    },
    {
        name: "Express.js TS",
        description: "Express.js TS template",
        notes: "Node.js and NPM must be installed.",
        templating: [
            {
                action: 'command',
                command: 'npm install express'
            },
            {
                action: 'command',
                command: 'npm install -D nodemon typescript ts-node @types/node @types/express'
            },
            {
                action: 'command',
                command: 'npm install -D tsup'
            },
            {
                action: 'file',
                file: 'index.ts',
                filecontent: expressFile
            },
            {
                action: 'file',
                file: 'tsup.config.ts',
                filecontent: "import { defineConfig } from 'tsup';\n\nexport default defineConfig({\n  entry: ['index.ts'],\n  splitting: false,\n  sourcemap: true,\n  clean: true,\n  format: ['cjs'],\n});"
            },
            {
                action: 'file',
                file: 'tsconfig.json',
                filecontent: '{\n  "compilerOptions": {\n    "target": "es2016",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "esModuleInterop": true,\n    "forceConsistentCasingInFileNames": true,\n    "strict": true,\n    "skipLibCheck": true\n  }\n}'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="nodemon --watch \'*.ts\' --exec \'ts-node\' index.ts"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.build="tsup"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="node dist/index.js"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="npx kill-port 3000"'
            }
        ]
    },
    {
        name: "PHP",
        description: "Simple PHP project template",
        notes: "PHP must be installed in your system.",
        templating: [
            {
                action: 'file',
                file: 'index.php',
                filecontent: '<?php\n\necho "Hello World! Monorepo Time!";\n'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="php -S localhost:3000"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="php -S localhost:3000"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="npx kill-port 3000"'
            }
        ]
    },
    {
        name: "Laravel",
        description: "Laravel PHP Framework template",
        notes: "Composer and PHP must be installed in your system.",
        templating: [
            {
                action: 'command',
                command: 'composer create-project laravel/laravel .'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="php artisan serve"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="php artisan serve"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="npx kill-port 8000"'
            }
        ]
    },
    {
        name: "Python Console",
        description: "Simple Python Console Application",
        notes: "Python 3 must be installed in your system.",
        templating: [
            {
                action: 'file',
                file: 'main.py',
                filecontent: pythonFile
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="python3 main.py"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="python3 main.py"'
            }
        ]
    },
    {
        name: ".NET Console",
        description: "Simple .NET Console Application",
        notes: ".NET SDK must be installed in your system.",
        templating: [
            {
                action: 'command',
                command: 'dotnet new console'
            },
            {
                action: 'file',
                file: 'Program.cs',
                filecontent: netFile
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="dotnet run"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="dotnet run"'
            }
        ]
    },

];
export default templates;