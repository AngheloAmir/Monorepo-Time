import type { ProjectTemplate } from "..";

const expressFile = `import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import helloRouter from "./routes/hello";

const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.use("/hello", helloRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
`;

const helloRouterFile = `import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

export default router;
`;

const htmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monorepo Time - Express Service</title>
    <style>
        body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            max-width: 500px;
            width: 100%;
            animation: fadeIn 0.8s ease-out;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
        }
        p {
            font-size: 1.1rem;
            color: #a0aec0;
            line-height: 1.6;
        }
        .status-badge {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.5rem 1rem;
            background: rgba(72, 187, 120, 0.2);
            color: #48bb78;
            border-radius: 50px;
            font-weight: 600;
            border: 1px solid rgba(72, 187, 120, 0.3);
            text-transform: uppercase;
            font-size: 0.8rem;
            letter-spacing: 1px;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Express Service</h1>
        <p>Your backend service is up and running successfully. Ready to handle API requests.</p>
        <p style="margin-top: 1rem; padding: 1rem; background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 8px; color: #ffc107; font-size: 0.9rem;">
            <strong>Caution:</strong> Any origin is allowed. Update the CORS configuration in <code>src/index.ts</code> and headers in <code>vercel.json</code> to whitelist only your frontend origin to prevent unauthorized usage.
        </p>
        <div class="status-badge">● System Online</div>
    </div>
</body>
</html>
`;

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
            action: 'command',
            cmd: 'npm',
            args: ['install', 'express', 'cors']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'nodemon', 'typescript', 'ts-node', '@types/node', '@types/express', '@types/cors']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'tsup']
        },
        {
            action: 'file',
            file: 'public/index.html',
            filecontent: htmlFile
        },
        {
            action: 'file',
            file: 'src/routes/hello.ts',
            filecontent: helloRouterFile
        },
        {
            action: 'file',
            file: 'src/index.ts',
            filecontent: expressFile
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
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-node text-green-500']
        }
    ]
};
