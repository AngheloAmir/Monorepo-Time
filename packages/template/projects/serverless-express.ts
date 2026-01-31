import type { ProjectTemplate } from "../../types";
import files from "./files/_serverless";

export const ServerlessExpressTS: ProjectTemplate = {
    name: "Serverless Express TS",
    description: "Serverless Express TS template optimized for Serverless (Netlify, Vercel, AWS) & Containers (Docker, Render, Fly.io)",
    notes: "Node.js and NPM must be installed.",
    type: "app",
    category: "Project",
    icon: "fab fa-node text-green-500",
    templating: [
        {
            action: 'command',
            cmd: 'npm',
            args: ['init', '-y']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', 'express', 'cors', 'serverless-http']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'nodemon', 'typescript', 'ts-node', 'tsup', '@types/node', '@types/express', '@types/cors']
        },
        // App Files
        {
            action: 'file',
            file: 'public/index.html',
            filecontent: files.htmlFile
        },
        {
            action: 'file',
            file: 'src/app.ts',
            filecontent: files.appFile
        },
        {
            action: 'file',
            file: 'src/local.ts',
            filecontent: files.localFile
        },
        {
            action: 'file',
            file: 'src/routes/hello.ts',
            filecontent: files.helloRouterFile
        },
        // Serverless Entry Points
        {
            action: 'file',
            file: 'api/index.ts',
            filecontent: files.vercelApiFile
        },
        {
            action: 'file',
            file: 'netlify/functions/api.ts',
            filecontent: files.netlifyFunctionFile
        },
        {
            action: 'file',
            file: 'src/lambda.ts',
            filecontent: files.lambdaFile
        },
        // Container Configs
        {
            action: 'file',
            file: 'Dockerfile',
            filecontent: files.dockerFile
        },
        {
            action: 'file',
            file: 'app.yaml',
            filecontent: "runtime: nodejs18\nservice: default\n"
        },
        {
            action: 'file',
            file: 'serverless.yml',
            filecontent: files.serverlessYmlFile
        },
        // Config Files
        {
            action: 'file',
            file: 'tsup.config.ts',
            filecontent: "import { defineConfig } from 'tsup';\n\nexport default defineConfig({\n  entry: ['src/local.ts', 'src/lambda.ts'],\n  splitting: false,\n  sourcemap: true,\n  clean: true,\n  format: ['cjs'],\n});"
        },
        {
            action: 'file',
            file: 'tsconfig.json',
            filecontent: '{\n  "compilerOptions": {\n    "target": "es2016",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "esModuleInterop": true,\n    "forceConsistentCasingInFileNames": true,\n    "strict": true,\n    "skipLibCheck": true\n  },\n  "include": ["src/**/*", "api/**/*", "netlify/**/*"]\n}'
        },
        // Deployment Configs
        {
            action: 'file',
            file: 'render.yaml',
            filecontent: `services:
  - type: web
    name: express-serverless-service
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
            action: 'file',
            file: 'vercel.json',
            filecontent: `{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/index" }
  ]
}`
        },
        {
            action: 'file',
            file: 'netlify.toml',
            filecontent: `[build]
  command = "npm run build"
  functions = "functions"

# Redirect all traffic to the lambda function
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/api"
  status = 200
  force = true`
        },
        // Scripts
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=nodemon --watch \'src/**/*.ts\' --exec \'ts-node\' src/local.ts']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.build=tsup']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node dist/local.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 3500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Serverless Express TS']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-aws text-orange-500']
        }
    ]
};
