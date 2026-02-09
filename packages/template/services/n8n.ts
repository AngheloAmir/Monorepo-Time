import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./n8n/dockerCompose";
import { gitignoreContent } from "./n8n/gitignore";
import { N8NAgent } from "./n8n/n8nAgent";
import { serverJs } from "./n8n/server";

export const N8NLocal: ProjectTemplate = {
    name: "N8N Local (Docker)",
    description: "N8N Workflow Automation",
    notes: "Requires Docker to run",
    type: "app",
    category: "Service",
    icon: "fas fa-project-diagram text-red-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: gitignoreContent
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: serverJs
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node index.js']
        },
        {
            action: 'root-command',
            cmd: 'node',
            args: ['-e', `require('fs').writeFileSync('n8nAgent.ts', 'export const N8NAgent = ' + JSON.stringify(${JSON.stringify(N8NAgent)}) + ';')`]
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=N8N Workflow Automation (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-project-diagram text-red-500']
        }
    ]
};
