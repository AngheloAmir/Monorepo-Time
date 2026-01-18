import type { ProjectTemplate } from "..";

const expressFile = `import express, { Request, Response } from "express";
const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
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
};
