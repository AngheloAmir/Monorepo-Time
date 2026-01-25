import type { ProjectTemplate } from "..";

const htmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monorepo Time - Universal Express Service</title>
    <style>
        body {
            background: linear-gradient(135deg, #2d2a4e 0%, #1c1c38 100%);
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }
        .container {
            text-align: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            backdrop-filter: blur(12px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            max-width: 550px;
            width: 100%;
            animation: fadeIn 0.8s ease-out;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #ff9966 0%, #ff5e62 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
        }
        p {
            font-size: 1.1rem;
            color: #c9d6ea;
            line-height: 1.6;
        }
        .status-badge {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 153, 102, 0.15);
            color: #ff9966;
            border-radius: 50px;
            font-weight: 600;
            border: 1px solid rgba(255, 153, 102, 0.25);
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }
        code {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Universal Express</h1>
        <p>Your serverless-ready service is active. Deploy to AWS, Vercel, Netlify, or Docker with zero config changes.</p>
        <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
             <span class="status-badge">AWS</span>
             <span class="status-badge">Netlify</span>
             <span class="status-badge">Vercel</span>
             <span class="status-badge">Docker</span>
        </div>
        <p style="margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.7;">
            Check <code>src/app.ts</code> for routing logic.
        </p>
    </div>
</body>
</html>
`;

const appFile = `import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import helloRouter from "./routes/hello";

const app = express();

app.use(cors());
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
   res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.use("/hello", helloRouter);

// Mount router at root and api paths to handle various gateway configurations
app.use("/.netlify/functions/api", router);
app.use("/api", router);
app.use("/", router);

export default app;
`;

const localFile = `import app from "./app";

const port = process.env.PORT || 3500;

app.listen(port, () => {
    console.log("Server running locally at http://localhost:" + port);
});
`;

const vercelApiFile = `import app from "../src/app";
export default app;
`;

const netlifyFunctionFile = `import app from "../../src/app";
import serverless from "serverless-http";
export const handler = serverless(app);
`;

const helloRouterFile = `import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

export default router;
`;

const lambdaFile = `import app from "./app";
import serverless from "serverless-http";
export const handler = serverless(app);
`;

const dockerFile = `# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Compile TS (if you are running build inside docker)
# RUN npm install typescript tsup
# RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]
`;

const serverlessYmlFile = `service: my-express-service

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  api:
    handler: dist/lambda.handler
    events:
      - httpApi: '*'
`;

export const ServerlessExpressTS: ProjectTemplate = {
    name: "Serverless Express TS",
    description: "Serverless Express TS template optimized for Serverless (Netlify, Vercel, AWS) & Containers (Docker, Render, Fly.io)",
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            cmd: 'npm',
            args: ['init', '-y']
        },
        // Dependencies
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', 'express', 'cors', 'serverless-http']
        },
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', '-D', 'nodemon', 'typescript', 'ts-node', 'tsup', '@types/node', '@types/express', '@types/cors']
        },
        // App Files
        {
            action: 'file',
            file: 'public/index.html',
            filecontent: htmlFile
        },
        {
            action: 'file',
            file: 'src/app.ts',
            filecontent: appFile
        },
        {
            action: 'file',
            file: 'src/local.ts',
            filecontent: localFile
        },
        {
            action: 'file',
            file: 'src/routes/hello.ts',
            filecontent: helloRouterFile
        },
        // Serverless Entry Points
        {
            action: 'file',
            file: 'api/index.ts',
            filecontent: vercelApiFile
        },
        {
            action: 'file',
            file: 'netlify/functions/api.ts',
            filecontent: netlifyFunctionFile
        },
        {
            action: 'file',
            file: 'src/lambda.ts',
            filecontent: lambdaFile
        },
        // Container Configs
        {
            action: 'file',
            file: 'Dockerfile',
            filecontent: dockerFile
        },
        {
            action: 'file',
            file: 'app.yaml',
            filecontent: "runtime: nodejs18\nservice: default\n"
        },
        {
            action: 'file',
            file: 'serverless.yml',
            filecontent: serverlessYmlFile
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
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-aws text-orange-500']
        }
    ]
};
