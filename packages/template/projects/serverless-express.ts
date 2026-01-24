import type { ProjectTemplate } from "..";

const appFile = `import express, { Request, Response } from "express";
import cors from "cors";
import helloRouter from "./routes/hello";

const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router();
router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from Serverless Express!" });
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
    name: "Universal Express TS",
    description: "Express.js TS template optimized for Serverless (Netlify, Vercel, AWS) & Containers (Docker, Render, Fly.io)",
    notes: "Works on Vercel, Netlify, AWS Lambda, Google Cloud, Render, Heroku & Docker.",
    templating: [
        {
            action: 'command',
            cmd: 'npm',
            args: ['init', '-y']
        },
        // Dependencies
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
