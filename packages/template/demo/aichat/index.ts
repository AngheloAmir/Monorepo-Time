// AI Chat Demo Template - Main Export
// Assembles all file contents and npm commands for the template

import type { ProjectTemplate } from "../..";
import { indexHTML } from "./files/indexHtml";
import { adminHTML } from "./files/adminHtml";
import { stylesCSS } from "./files/stylesTs";
import { serverTs, tsconfigJson, tsupConfig } from "./files/serverTs";
import { vectorStoreTs } from "./files/vectorStoreTs";
import { aiClientTs } from "./files/aiClientTs";
import { chatRouteTs, embedRouteTs, configRouteTs } from "./files/routesTs";

export const AIChat: ProjectTemplate = {
    name: "AI Chat",
    description: "Fullstack AI Customer Support Chat - Chat with your FAQ/Knowledge Base",
    notes: "Requires Node.js, NPM, and an OpenAI-compatible API key",
    templating: [
        // Install dependencies
        {
            action: 'command',
            cmd: 'npm',
            args: ['init', '-y']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', 'express']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'nodemon', 'typescript', 'ts-node', '@types/node', '@types/express', 'tsup']
        },
        // Public files
        {
            action: 'file',
            file: 'public/index.html',
            filecontent: indexHTML
        },
        {
            action: 'file',
            file: 'public/admin.html',
            filecontent: adminHTML
        },
        {
            action: 'file',
            file: 'public/styles.css',
            filecontent: stylesCSS
        },
        // Source files
        {
            action: 'file',
            file: 'src/index.ts',
            filecontent: serverTs
        },
        {
            action: 'file',
            file: 'src/vectorStore.ts',
            filecontent: vectorStoreTs
        },
        {
            action: 'file',
            file: 'src/aiClient.ts',
            filecontent: aiClientTs
        },
        {
            action: 'file',
            file: 'src/routes/chat.ts',
            filecontent: chatRouteTs
        },
        {
            action: 'file',
            file: 'src/routes/embed.ts',
            filecontent: embedRouteTs
        },
        {
            action: 'file',
            file: 'src/routes/config.ts',
            filecontent: configRouteTs
        },
        // Config files
        {
            action: 'file',
            file: 'tsconfig.json',
            filecontent: tsconfigJson
        },
        {
            action: 'file',
            file: 'tsup.config.ts',
            filecontent: tsupConfig
        },
        // NPM scripts
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
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-comments']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        }
    ]
};
