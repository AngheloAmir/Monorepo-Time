import type { ProjectTemplate } from "..";

const expressFile = `import express, { Request, Response } from "express";
import path from "path";
import helloRouter from "./routes/hello";

const app = express();
const port = 3500;

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
    <title>Server Status</title>
    <style>
        body {
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: sans-serif;
        }
    </style>
</head>
<body>
    <h1>Server running</h1>
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
            command: 'npm pkg set scripts.dev="nodemon --watch \'src/**/*.ts\' --exec \'ts-node\' src/index.ts"'
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
            command: 'npm pkg set scripts.stop="npx -y kill-port 3500"'
        },
        {
            action: 'command',
            command: "npm pkg set scripts.fontawesomeIcon=\"fa-solid fa-server\""
        }
    ]
};
