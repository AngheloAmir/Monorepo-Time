import type { ProjectTemplate } from "..";
import files from "./files/_express";

export const ExpressTS: ProjectTemplate = {
    name: "Express.js TS",
    description: "Express.js TS template",
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            cmd: 'npm',
            args: ['init', '-y']
        },
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', 'express', 'cors']
        },
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', '-D', 'nodemon', 'typescript', 'ts-node', '@types/node', '@types/express', '@types/cors']
        },
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', '-D', 'tsup']
        },
        {
            action: 'file',
            file: 'public/index.html',
            filecontent: files.htmlFile
        },
        {
            action: 'file',
            file: 'src/routes/hello.ts',
            filecontent: files.helloRouterFile
        },
        {
            action: 'file',
            file: 'src/index.ts',
            filecontent: files.expressFile
        },
        {
            action: 'file',
            file: 'tsup.config.ts',
            filecontent: "import { defineConfig } from 'tsup';\n\nexport default defineConfig({\n  entry: ['src/index.ts'],\n  splitting: false,\n  sourcemap: true,\n  clean: true,\n  format: ['cjs'],\n});"
        },
        {
            action: 'file',
            file: 'tsconfig.json',
            filecontent: '{\n  "compilerOptions": {\n    "target": "es2016",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "esModuleInterop": true,\n    "forceConsistentCasingInFileNames": true,\n    "strict": true,\n    "skipLibCheck": true\n  }\n}'
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=nodemon --watch \'src/**/*.ts\' --exec \'ts-node\' src/index.ts']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.build=tsup']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node dist/index.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 3500']
        },
        {
            action: 'file',
            file: 'vercel.json',
            filecontent: `{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/dist/index.js"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" }
      ]
    }
  ]
}`
        },
        {
            action: 'file',
            file: 'render.yaml',
            filecontent: `services:
  - type: web
    name: express-service
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000`
        },
        {
            action: 'file',
            file: 'Procfile',
            filecontent: 'web: npm start'
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Express.js TS']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-node text-green-500']
        }
    ]
};
